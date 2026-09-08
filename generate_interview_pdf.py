import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, KeepTogether, Table, TableStyle
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

def create_interview_pdf(filename="Pathfinder_Interview_QnA.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#0f172a'),
        alignment=TA_CENTER,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#475569'),
        alignment=TA_CENTER,
        spaceAfter=20
    )

    cat_heading_style = ParagraphStyle(
        'CatHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=colors.HexColor('#0f766e'),
        spaceBefore=14,
        spaceAfter=10,
        keepWithNext=True
    )

    q_title_style = ParagraphStyle(
        'QTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    ans_style = ParagraphStyle(
        'AnsBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#334155'),
        alignment=TA_JUSTIFY,
        spaceAfter=8
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#0f172a'),
        backColor=colors.HexColor('#f1f5f9'),
        borderColor=colors.HexColor('#cbd5e1'),
        borderWidth=0.5,
        borderPadding=4,
        spaceBefore=4,
        spaceAfter=6
    )

    story = []

    # Title & Header
    story.append(Paragraph("Pathfinder: Complete Interview Master Guide", title_style))
    story.append(Paragraph("Comprehensive 50-Question Technical Q&A Architecture, Algorithms, Security & System Design", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0f766e'), spaceAfter=15))

    q_data = [
        # SECTION 1
        ("Architecture & Design", [
            ("1. What is the overall architecture of this project, and why was it structured this way?",
             "Pathfinder follows a decoupled Client-Server REST architecture. The frontend is built as a single-page React application (SPA) using Vite, while the backend is an Express.js / Node.js REST API backed by MongoDB. Business logic is separated into layered modules: Routes (HTTP endpoints), Controllers (request handling), Services (Held-Karp TSP solver & OSRM integration), and Models (Mongoose ORM). This separation ensures independent scalability, clear separation of concerns, and robust client-side fallback mechanisms."),
            
            ("2. Why did we choose this tech stack over alternatives?",
             "• React + Vite: Fast HMR development, component reusability, and efficient DOM updates.\n• Node.js & Express: Non-blocking asynchronous I/O ideal for proxying external routing services.\n• MongoDB & Mongoose: Flexible document model suitable for storing city spot collections and dynamic trip payloads.\n• Leaflet & OpenStreetMap: Open-source map rendering without restrictive Google API pricing or quotas."),

            ("3. What design patterns are used in this codebase, and where?",
             "• Strategy / Fallback Pattern: Used in routing (OSRM Matrix → Haversine Matrix fallback) and databases (MongoDB → In-Memory fallback).\n• MVC / Layered Architecture: Strict split between Routes, Controllers, Services, and Models.\n• Context Provider Pattern: React RouteContext and AuthContext manage global application state.\n• Async Wrapper Middleware: asyncHandler wraps Express controllers for standardized error catching."),

            ("4. How do the different modules/components communicate with each other?",
             "React UI components invoke hooks (useRoute, useAuth) which trigger API functions in api.js using Axios. Requests hit Express route handlers, which pass parameters to domain services (tspSolver.js). tspSolver fetches matrices via osrmService.js before returning optimal sequences."),

            ("5. What does the data flow look like from user input to final output?",
             "User selects spots → handleOptimize() triggers runOptimization() → Axios sends POST to /api/optimize → routeController validates input & queries City model → tspSolver queries OSRM matrix → heldKarpTSP calculates optimal path → /api/route-geometry fetches GeoJSON polyline → Results.jsx & MapView render pure distance metrics & route map."),

            ("6. Why is the database schema/data model structured this way?",
             "• User Schema: Stores credentials with bcrypt hashing.\n• City Schema: Embeds sightseeing spots directly inside city documents to avoid expensive joins during optimization.\n• Trip Schema: Stores standalone snapshot documents containing selected spot IDs, computed legs, and distance metrics."),

            ("7. What would you change about the architecture if starting over?",
             "Introduce a Redis caching layer for OSRM distance matrices, implement TypeScript for static type safety across API contracts, and offload CPU-intensive TSP solving to background worker threads."),

            ("8. How is this project organized (folder structure, separation of concerns)?",
             "Split structure with frontend/ and backend/. Frontend houses api/, components/, context/, pages/, utils/. Backend houses controllers/, db/, middleware/, models/, routes/, services/, utils/, validators/.")
        ]),

        # SECTION 2
        ("Core Logic Deep-Dive", [
            ("9. Walk me through what happens step-by-step when Route Optimization runs.",
             "1. User clicks 'Optimize Route'.\n2. runOptimization sets loading state and POSTs to /api/optimize.\n3. Backend resolves place coordinates from DB or memory.\n4. fetchOsrmMatrix retrieves pairwise road distances from OSRM (or Haversine fallback).\n5. heldKarpTSP runs bitmask DP to compute the exact minimum distance sequence.\n6. fetchRouteGeometry retrieves GeoJSON polyline coordinates.\n7. State updates, rendering ordered stops and polyline map."),

            ("10. Explain the heldKarpTSP() solver function in detail.",
             "heldKarpTSP takes distance & duration matrices, place arrays, and roundTrip flag. It initializes a 2D DP table dp[1 << N][N] with Infinity. Base state: dp[1][0] = 0. It iterates bitmasks from 1 to (2^N - 1), updating transitions: dp[nextMask][v] = min(dp[nextMask][v], dp[mask][u] + matrix[u][v]). It tracks parent state transitions to reconstruct the path backward."),

            ("11. What is the most complex piece of logic in this project, and why?",
             "The Bitmask Dynamic Programming Held-Karp solver. It is complex because bitwise operations (mask & (1 << u), mask | (1 << v), mask ^ (1 << node)) track visited node subsets in O(N^2 * 2^N) time without generating factorial permutations."),

            ("12. What algorithms are used here, and what's their time/space complexity?",
             "• Held-Karp DP TSP Solver: O(N^2 * 2^N) Time, O(N * 2^N) Space.\n• Nearest-Neighbor Solver (Fallback): O(N^2) Time, O(N) Space.\n• Haversine Distance Formula: O(1) Time per pair."),

            ("13. What happens if this function receives unexpected/invalid input?",
             "Invalid inputs (empty array, non-array placeIds) trigger ApiError(400) responses. If backend fails, frontend executes client-side fallback solver fallbackOptimizeClient without crashing."),

            ("14. Why did we use Bitmask DP Table & Pairwise Matrix data structures?",
             "2D Bitmask DP tables allow O(1) state lookups for node subsets instead of expensive recursive stacks. Flat 2D arrays (matrix[u][v]) provide cache-friendly distance lookups."),

            ("15. What would break if I removed ApiResponse or OSRM Service?",
             "If ApiResponse is removed without updating API unwrapping, result.order becomes undefined (causing 0 places bug). If OSRM Service is removed, Pathfinder seamlessly falls back to Haversine matrices."),

            ("16. How does error handling work throughout this project?",
             "Backend wraps async controllers in asyncHandler and handles errors via error.middleware.js. Frontend Axios interceptors catch failures and execute client-side fallback solvers.")
        ]),

        # SECTION 3
        ("Tradeoffs & Alternatives", [
            ("17. What are the biggest weaknesses or limitations of this implementation?",
             "Held-Karp DP is capped at N <= 12 due to O(2^N) memory growth. Reliance on free public OSRM servers introduces potential latency."),

            ("18. What other approaches could have solved this problem?",
             "Genetic Algorithms (GA), Ant Colony Optimization (ACO), or 2-Opt local search heuristics for large N > 100."),

            ("19. Why didn't we use Google Maps Matrix API / Redux / Next.js?",
             "Google Maps Matrix API incurs high per-request costs; OSRM is free and open-source. Redux adds unnecessary boilerplate for lightweight state."),

            ("20. What tradeoffs did we make for speed of development vs. code quality?",
             "Embedded fallback city data in static JSON to ensure offline functionality and capped N <= 12 to avoid multi-threading overhead."),

            ("21. If this had to scale to 100x more users/data, what would break first?",
             "Public OSRM demo server rate-limits would fail first under load, followed by CPU saturation during concurrent DP solving."),

            ("22. What technical debt exists in this project?",
             "Response payload unwrapping logic repeated across utility helpers, and lack of automated unit/integration test coverage."),

            ("23. What would you prioritize fixing first if given more time?",
             "Deploy self-hosted OSRM via Docker, offload TSP solving to Node.js worker threads, and add Jest unit tests."),

            ("24. Are there simpler ways to achieve the same functionality?",
             "A pure nearest-neighbor greedy algorithm (O(N^2)) is simpler, though 10-25% sub-optimal compared to Held-Karp exact DP.")
        ]),

        # SECTION 4
        ("Security", [
            ("25. What security vulnerabilities could exist in this code?",
             "Missing API rate-limiting on /api/optimize (potential DoS risk) and permissive CORS settings in development mode."),

            ("26. How is user input validated and sanitized?",
             "express-validator and joi sanitize auth payloads. Array inputs (placeIds) are verified for length and capped at 12 items."),

            ("27. How is authentication/authorization handled, and is it secure?",
             "Passwords hashed with bcryptjs. JWT tokens issued upon login stored in httpOnly, secure cookies protecting against XSS theft."),

            ("28. Are there any exposed secrets, keys, or sensitive data risks?",
             "Environment variables (dotenv) isolate PORT, MONGODB_URI, and JWT_SECRET. Secrets are excluded from version control."),

            ("29. How would this code handle a malicious user trying to break it?",
             "Array inputs with 1,000,000 items are sliced to max 12 items, preventing memory overflow DoS attacks.")
        ]),

        # SECTION 5
        ("Performance", [
            ("30. What are the performance bottlenecks in this project?",
             "External OSRM HTTP network latency (200ms-800ms) and exponential CPU growth of Held-Karp DP for N > 15."),

            ("31. How would you optimize the slowest part of this code?",
             "Cache pairwise OSRM distance matrices in Redis with a 24-hour TTL keyed by cityId:mode:hash(placeIds)."),

            ("32. How is memory/resource usage managed?",
             "DP state arrays are garbage-collected after solving. N is capped at 12 to guarantee memory consumption stays < 5 MB per request."),

            ("33. What caching strategies are used or could be used?",
             "Browser caching for OpenStreetMap tiles. Redis caching for OSRM matrix requests."),

            ("34. How many API calls/database queries happen per request?",
             "1 DB query + 1 OSRM Table call + 1 OSRM Route call = 3 total external calls per optimization.")
        ]),

        # SECTION 6
        ("Testing & Debugging", [
            ("35. What testing strategy does this project use, and what's not covered?",
             "Manual end-to-end integration testing via Vite and Node execution. Automated unit/E2E test suites are not yet implemented."),

            ("36. What bugs did we encounter while building this, and how were they fixed?",
             "• Bug 1: verifyJWT blocking guest optimization (Fixed by making /api/optimize public).\n• Bug 2: '0 places / 0.0 km' bug due to ApiResponse wrapping (Fixed by unwrapping res.data?.data || res.data).\n• Bug 3: City reset on switch (Fixed state persistence)."),

            ("37. How would you test this feature manually and automatically?",
             "Manually: Select 5 spots in Udaipur, optimize, toggle travel modes, check Google Maps link. Automatically: Jest unit tests for heldKarpTSP()."),

            ("38. What edge cases are NOT handled in this code?",
             "Co-located places (identical coordinates) and locations separated by bodies of water with no road connections."),

            ("39. How do you debug an issue if this feature stops working in production?",
             "Inspect DevTools Network tab, check Node server logs for OSRM timeouts, and verify MongoDB connectivity state.")
        ]),

        # SECTION 7
        ("AI-Usage Specific", [
            ("40. Which parts of this code did AI generate vs. what did I write/modify?",
             "AI assisted with initial schema boilerplate and DP scaffolding. I architected state management, debugged API response unwrapping bugs, and implemented pure-distance UI."),

            ("41. What did I have to fix or change after the AI generated it?",
             "Fixed ApiResponse payload unwrapping mismatch, removed restrictive JWT auth from public optimization routes, and refactored Results UI."),

            ("42. Explain a moment where AI-generated code was wrong or needed correction.",
             "AI wrapped responses in ApiResponse(200, data) but frontend expected direct objects (res.data.order), resulting in undefined order array."),

            ("43. What did I learn about this technology by building this project?",
             "Understood Bitmask Dynamic Programming for NP-hard TSP problems and OSRM routing engine integrations."),

            ("44. If asked 'do you actually understand this code,' what's my honest answer?",
             "Yes, completely. Can walk through bitmask state transitions in heldKarpTSP(), OSRM matrix queries, and React context state propagation.")
        ]),

        # SECTION 8
        ("Communication & Presentation", [
            ("45. Explain this entire project in 2 minutes for a non-technical interviewer.",
             "Pathfinder is a smart travel optimizer that solves a common tourist problem: 'What is the shortest route to visit all sightseeing spots in a city?' Pathfinder lets users pick a city, select spots, choose travel mode (walking, bike, car), and instantly computes the mathematically shortest route using Held-Karp algorithms, displaying turn-by-turn paths on maps with Google Maps export."),

            ("46. Explain this entire project in 30 seconds (elevator pitch version).",
             "Pathfinder is a travel route optimization app that solves the Traveling Salesperson Problem for tourists. It computes the mathematically shortest visiting order using Held-Karp DP and OSRM road data, visualizing routes on interactive maps with Google Maps export."),

            ("47. What was the hardest technical problem you solved in this project, and how?",
             "Diagnosing and resolving an API response wrapper mismatch that caused '0 destinations / 0.0 km' output. Traced Axios response structures, fixed the API unwrapping layer in api.js, and implemented defensive fallback place mapping."),

            ("48. What would you build next if you continued this project?",
             "Time-window constraints (opening/closing hours), multi-day itinerary splitting, and offline Progressive Web App (PWA) support."),

            ("49. What did you learn from this project that you'd apply to future work?",
             "Always build defensive unwrapping layers for API responses, implement resilient fallbacks for external services, and use exact DP algorithms when problem sizes (N <= 12) allow."),

            ("50. What questions might an interviewer ask that I haven't thought of — and how would I answer?",
             "Q: 'How do you handle TSP if a user selects 50 spots?' A: Held-Karp DP is O(N^2 * 2^N), so for N=50 it would crash. For N > 15, I would switch to 2-Opt local search or Genetic Algorithms.")
        ])
    ]

    for cat_title, q_list in q_data:
        story.append(Paragraph(cat_title, cat_heading_style))
        story.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor('#0f766e'), spaceAfter=8))
        
        for q_text, ans_text in q_list:
            q_paragraph = Paragraph(q_text, q_title_style)
            
            # Format answers with proper line breaks
            ans_lines = ans_text.split('\n')
            ans_paragraphs = [Paragraph(line.replace('•', '&bull;'), ans_style) for line in ans_lines if line.strip()]
            
            card = [q_paragraph] + ans_paragraphs + [Spacer(1, 4)]
            story.append(KeepTogether(card))

    doc.build(story)
    print(f"Successfully generated PDF: {os.path.abspath(filename)}")

if __name__ == '__main__':
    create_interview_pdf()
