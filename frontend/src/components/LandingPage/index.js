import React from "react";
import { useSelector } from "react-redux";
import "./LandingPage.css"; // Import your CSS file for styling

function LandingPage() {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="landing-page">
      {/* Section 1 */}
      <section className="section1">
        <div className="section1-content">
          <div className="section1-text">
            <h1>Title for Section 1</h1>
            <p>Intro text for Section 1 goes here.</p>
          </div>
          <div className="section1-infographic">
            {/* Your infographic content goes here */}
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="section2">
        <div className="section2-content">
          <h2>Subtitle for Section 2</h2>
          <p>Caption for Section 2 goes here.</p>
        </div>
      </section>

      {/* Section 3 */}
      <section className="section3">
        <div className="section3-content">
          <div className="section3-column">
            <div className="section3-icon">Icon 1</div>
            <a href="/view-groups" className="section3-link">
              See all groups
            </a>
            <div className="section3-caption">Caption 1</div>
          </div>
          <div className="section3-column">
            <div className="section3-icon">Icon 2</div>
            <a href="/view-events" className="section3-link">
              Find an event
            </a>
            <div className="section3-caption">Caption 2</div>
          </div>
          <div className="section3-column">
            <div className="section3-icon">Icon 3</div>
            {sessionUser ? (
              <a href="/create-group" className="section3-link">
                Start a group
              </a>
            ) : (
              <span className="section3-disabled-link">Start a group</span>
            )}
            <div className="section3-caption">Caption 3</div>
          </div>
        </div>
      </section>

      {/* Section 4 */}
      <section className="section4">
        <div className="section4-content">
          <button className="join-meetus-button">Join Meetus</button>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
