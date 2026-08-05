import {
  Link,
} from "react-router-dom";

import "../styles/aiAssistant.css";

function AIAssistantPage() {
  return (
    <main className="ai-coming-soon-page">
      <section className="ai-coming-soon-card">
        <p className="ai-coming-soon-eyebrow">
          AI Assistant
        </p>

        <h1>Coming Soon!</h1>

        <p className="ai-coming-soon-description">
          Our AI-powered scouting assistant is
          currently under development. It will
          help players, coaches, and organizers
          complete tasks and navigate the
          recruitment process more efficiently.
        </p>

        <Link
          to="/"
          className="ai-coming-soon-home-button"
        >
          Return to Home
        </Link>
      </section>
    </main>
  );
}

export default AIAssistantPage;