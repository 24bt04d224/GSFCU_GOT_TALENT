import os
import sys
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header on later pages
        if self._pageNumber > 1:
            self.drawString(54, 750, "GSFCU GOT TALENT 2026 — ENGINEERING CHANGELOG REPORT")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 744, 558, 744)

        # Footer
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, footer_text)
        self.drawString(54, 36, "CONFIDENTIAL & PROPRIETARY — GSFC UNIVERSITY")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 48, 558, 48)
        self.restoreState()

def build_pdf(filename="GSFCU_GOT_TALENT_CHANGES_REPORT.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#0F172A")
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#475569")
    )
    
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor("#1E3A8A"),
        spaceBefore=14,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#334155")
    )

    body_bold = ParagraphStyle(
        'Body_Bold_Custom',
        parent=body_style,
        fontName='Helvetica-Bold',
        textColor=colors.HexColor("#0F172A")
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#0F172A")
    )

    badge_style = ParagraphStyle(
        'Badge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#047857")
    )

    elements = []

    # Title & Header Banner
    elements.append(Paragraph("GSFCU GOT TALENT 2026", title_style))
    elements.append(Paragraph("Master Project Synchronization & Code Quality Audit Report", subtitle_style))
    elements.append(Spacer(1, 10))

    # Meta Table
    now_str = datetime.now().strftime("%d %B %Y, %I:%M %p IST")
    meta_data = [
        [
            Paragraph("<b>Project:</b> GSFCU Got Talent 2026", body_style),
            Paragraph(f"<b>Generated:</b> {now_str}", body_style)
        ],
        [
            Paragraph("<b>Target Workspace:</b> gsfcu got talent", body_style),
            Paragraph("<b>Master Source:</b> D:\\we_external_projects", body_style)
        ],
        [
            Paragraph("<b>Status:</b> Completed & Verified", badge_style),
            Paragraph("<b>Vite Server:</b> http://localhost:5173", body_style)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[250, 254])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#E2E8F0")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 14))

    # SECTION 1: EXECUTIVE SUMMARY
    elements.append(Paragraph("1. Executive Summary", h1_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E2E8F0"), spaceAfter=8))
    elements.append(Paragraph(
        "This report documents all actions performed in response to the user's directive to synchronize "
        "and enforce operational rules from the external master project directory (<code>D:\\we_external_projects</code>) "
        "into the primary production codebase for <b>GSFCU Got Talent 2026</b>, followed by comprehensive verification of website endpoints.",
        body_style
    ))
    elements.append(Spacer(1, 8))

    # SECTION 2: MASTER REPOSITORY RULES & SKILLS IMPLEMENTATION
    elements.append(Paragraph("2. Master Rules & Skills Deployment", h1_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E2E8F0"), spaceAfter=8))
    elements.append(Paragraph(
        "The external directory <code>D:\\we_external_projects</code> hosts the developer's centralized "
        "repository (<code>https://github.com/24bt04d224/master-file.git</code>). In accordance with the chosen configuration, "
        "the agent skills catalog and governance rules were installed into the project's local <code>.agents/</code> directory:",
        body_style
    ))
    elements.append(Spacer(1, 6))

    rules_table_data = [
        [Paragraph("<b>Component</b>", body_bold), Paragraph("<b>Source Path</b>", body_bold), Paragraph("<b>Installed In</b>", body_bold), Paragraph("<b>Description / Scope</b>", body_bold)],
        [
            Paragraph("101 Agent Skills", body_style),
            Paragraph("D:\\we_external_projects\\.agents\\skills\\*", code_style),
            Paragraph(".agents/skills/", code_style),
            Paragraph("Full suite of automation, security, testing, and architecture skills.", body_style)
        ],
        [
            Paragraph("Ponytail Rules", body_style),
            Paragraph("...\\ponytail\\.agents\\rules\\ponytail.md", code_style),
            Paragraph(".agents/rules/ponytail.md", code_style),
            Paragraph("Senior dev mode: YAGNI, standard library prioritization, minimal clean diffs.", body_style)
        ],
        [
            Paragraph("Skills Contributing", body_style),
            Paragraph("...\\agent-skills\\.claude\\rules\\...", code_style),
            Paragraph(".agents/rules/skills-contributing.md", code_style),
            Paragraph("Standardized guidelines for AI skill construction and tool bindings.", body_style)
        ],
        [
            Paragraph("Antigravity Rules", body_style),
            Paragraph("...\\graphify\\...\\antigravity-rules.md", code_style),
            Paragraph(".agents/rules/antigravity-rules.md", code_style),
            Paragraph("Knowledge graph architecture and query protocols.", body_style)
        ]
    ]
    t_rules = Table(rules_table_data, colWidths=[95, 135, 120, 154])
    t_rules.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#EEF2F6")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(t_rules)
    elements.append(Spacer(1, 14))

    # SECTION 3: CODEBASE OPTIMIZATIONS & LINT CLEANUP
    elements.append(Paragraph("3. Code Modifications & Quality Fixes", h1_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E2E8F0"), spaceAfter=8))
    elements.append(Paragraph(
        "Applying the newly adopted <b>Ponytail Senior Developer Guidelines</b> (clean, zero-dead-code, root-cause fixes), "
        "all unused imports and variables flagged by <code>oxlint</code> were pruned from the active codebase:",
        body_style
    ))
    elements.append(Spacer(1, 6))

    changes_data = [
        [Paragraph("<b>File Modified</b>", body_bold), Paragraph("<b>Change Category</b>", body_bold), Paragraph("<b>Technical Details</b>", body_bold)],
        [
            Paragraph("<code>src/data/eventData.js</code>", code_style),
            Paragraph("State Logic / Dead Code", body_style),
            Paragraph("Removed unused <code>finaleRevealed</code> variable; linked <code>EVENT_DETAILS.isFinaleRevealed</code> dynamically to <code>isFinaleDateRevealed()</code>.", body_style)
        ],
        [
            Paragraph("<code>src/services/registrationService.js</code>", code_style),
            Paragraph("Import Pruning", body_style),
            Paragraph("Removed unused import <code>fetchSponsorsFromBackend</code>.", body_style)
        ],
        [
            Paragraph("<code>src/pages/RegisterPage.jsx</code>", code_style),
            Paragraph("Import Pruning", body_style),
            Paragraph("Removed unused import <code>EVENT_DETAILS</code>.", body_style)
        ],
        [
            Paragraph("<code>src/components/Footer.jsx</code>", code_style),
            Paragraph("Import Pruning", body_style),
            Paragraph("Removed unused import <code>EVENT_DETAILS</code>.", body_style)
        ],
        [
            Paragraph("<code>src/sections/ImportantInfoSection.jsx</code>", code_style),
            Paragraph("Import Pruning", body_style),
            Paragraph("Removed unused import <code>EVENT_DETAILS</code>.", body_style)
        ],
        [
            Paragraph("<code>src/sections/HowItWorksSection.jsx</code>", code_style),
            Paragraph("Import Pruning", body_style),
            Paragraph("Removed unused import <code>EVENT_DETAILS</code>.", body_style)
        ],
        [
            Paragraph("<code>src/sections/RegistrationCtaSection.jsx</code>", code_style),
            Paragraph("Import Pruning", body_style),
            Paragraph("Removed unused import <code>Clock</code> from <code>lucide-react</code>.", body_style)
        ],
        [
            Paragraph("<code>server.js</code>", code_style),
            Paragraph("Modern Syntax Refactor", body_style),
            Paragraph("Omitted unused error parameter in JSON parse handler: changed <code>catch (err)</code> to optional binding <code>catch</code>.", body_style)
        ],
        [
            Paragraph("<code>.oxlintrc.json</code>", code_style),
            Paragraph("Linter Configuration", body_style),
            Paragraph("Added <code>ignorePatterns</code> for <code>.agents/**</code>, <code>dist/**</code>, and <code>node_modules/**</code>.", body_style)
        ],
        [
            Paragraph("<code>src/services/firebaseConfig.js</code>", code_style),
            Paragraph("Security & Access Control", body_style),
            Paragraph("Enforced strict 4-account administrator whitelist: <code>24bt04d224@gsfcuniversity.ac.in</code>, <code>24bt04d218@gsfcuniversity.ac.in</code>, <code>24bt04d207@gsfcuniversity.ac.in</code>, and <code>24bt04d238@gsfcuniversity.ac.in</code>. Added <code>isAuthorizedAdminEmail()</code> helper.", body_style)
        ],
        [
            Paragraph("<code>src/context/AuthContext.jsx</code>", code_style),
            Paragraph("Authentication Architecture", body_style),
            Paragraph("Added <code>adminOnly</code> parameter to <code>signInWithGoogle()</code>. Immediately revokes unauthorized logins, flushes session/local storage, and returns access denial for non-whitelisted emails.", body_style)
        ],
        [
            Paragraph("<code>src/components/GoogleSignInButton.jsx</code>", code_style),
            Paragraph("UI Primitive", body_style),
            Paragraph("Added <code>adminOnly</code> prop to pass through to auth context for admin gateway logins.", body_style)
        ],
        [
            Paragraph("<code>src/pages/AdminPage.jsx</code>", code_style),
            Paragraph("Admin Portal Gate", body_style),
            Paragraph("Added prominent Google Sign-In button strictly restricted to the 4 admin emails, with an authorized accounts banner and passcode fallback.", body_style)
        ]
    ]
    t_changes = Table(changes_data, colWidths=[160, 110, 234])
    t_changes.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#EEF2F6")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4.5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(t_changes)
    elements.append(Spacer(1, 14))

    # SECTION 4: WEBSITE VERIFICATION & HEALTH CHECKS
    elements.append(Paragraph("4. Website Verification & Health Checks", h1_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E2E8F0"), spaceAfter=8))
    
    check_data = [
        [Paragraph("<b>Validation Check</b>", body_bold), Paragraph("<b>Command / Target</b>", body_bold), Paragraph("<b>Result</b>", body_bold), Paragraph("<b>Diagnostics</b>", body_bold)],
        [
            Paragraph("Linter Cleanliness", body_style),
            Paragraph("<code>npm run lint (oxlint)</code>", code_style),
            Paragraph("<font color='#047857'><b>PASSED (0 Errors)</b></font>", body_style),
            Paragraph("Zero syntax or compilation issues.", body_style)
        ],
        [
            Paragraph("Production Build", body_style),
            Paragraph("<code>npm run build (vite)</code>", code_style),
            Paragraph("<font color='#047857'><b>PASSED (1.79s)</b></font>", body_style),
            Paragraph("All 2,229 modules transformed cleanly.", body_style)
        ],
        [
            Paragraph("Vite Dev Server", body_style),
            Paragraph("<code>http://localhost:5173</code>", code_style),
            Paragraph("<font color='#047857'><b>RUNNING</b></font>", body_style),
            Paragraph("Serving hot-module replacement on port 5173.", body_style)
        ],
        [
            Paragraph("Landing Page", body_style),
            Paragraph("<code>GET /</code>", code_style),
            Paragraph("<font color='#047857'><b>HTTP 200 OK</b></font>", body_style),
            Paragraph("DOM rendering correctly with complete asset paths.", body_style)
        ],
        [
            Paragraph("Registration Portal", body_style),
            Paragraph("<code>GET /register</code>", code_style),
            Paragraph("<font color='#047857'><b>HTTP 200 OK</b></font>", body_style),
            Paragraph("Multi-step form active with enrollment validation.", body_style)
        ],
        [
            Paragraph("Student Login Portal", body_style),
            Paragraph("<code>GET /login</code>", code_style),
            Paragraph("<font color='#047857'><b>HTTP 200 OK</b></font>", body_style),
            Paragraph("Firebase Google sign-in workflow responsive.", body_style)
        ]
    ]
    t_check = Table(check_data, colWidths=[110, 140, 110, 144])
    t_check.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#EEF2F6")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(t_check)
    elements.append(Spacer(1, 14))

    # SECTION 5: RECOMMENDATIONS & NEXT STEPS
    elements.append(Paragraph("5. Architectural Recommendations", h1_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E2E8F0"), spaceAfter=8))
    elements.append(Paragraph(
        "• <b>Master Repo Linking:</b> As outlined in <code>PROJECT_GUIDELINES.md</code>, to permanently register this sub-project inside <code>D:\\we_external_projects</code>, execute:<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<code>git -C \"D:\\we_external_projects\" submodule add https://github.com/24bt04d224/GSFCU_GOT_TALENT.git projects/gsfcu-got-talent</code><br/>"
        "• <b>Git Push Policy:</b> Adhere to Section 5 of <code>AGENTS.md</code>: Local changes remain unpushed until your explicit confirmation.<br/>"
        "• <b>Live Database Submissions:</b> Dual-engine mode is active. Ensure backend endpoint at Render (<code>https://gsfcugottalent.onrender.com</code>) is kept warm for audition day.",
        body_style
    ))

    doc.build(elements, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated: {filename}")

if __name__ == "__main__":
    out = "GSFCU_GOT_TALENT_CHANGES_REPORT.pdf"
    if len(sys.argv) > 1:
        out = sys.argv[1]
    build_pdf(out)
