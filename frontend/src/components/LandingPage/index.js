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
            <h1>The people platform—Where interests become friendships</h1>
            <p>Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Meetup. Events are happening every day—sign up to join the fun.</p>
          </div>
          <div className="section1-infographic">
          <img src="https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=640" alt="Infographic" />
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="section2">
        <div className="section2-content">
          <h2>How Meetup works</h2>
          <div className="section2-content-into">
          <p>Meet new people who share your interests through online and in person events. It’s free to create an account.</p>
          </div>
        </div>
      </section>

      <section className="section3">
    <div className="section3-part1">
      <img src= 'https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=256' alt='icon1'/>
      <a href="/view-groups" className="section3-link">
        See all groups
      </a>
      <div className="section3-caption">
        <p>Do what you love, meet others who love it, find your community. The rest is history!</p></div>
    </div>
    <div className="section3-part2">
      <img src= 'https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=256' alt='icon2'/>
      <a href="/view-events" className="section3-link">
        Find an event
      </a>
      <div className="section3-caption">Events are happening on just about any topic you can think of, from online gaming and photography to yoga and hiking.</div>
    </div>
    <div className="section3-part3">
      <img src= 'https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=256' alt='icon3'/>
      {sessionUser ? (
        <a href="/create-group" className="section3-link">
          Start a group
        </a>
    ) : (
      <span className="section3-disabled-link">Start a group</span>
    )}
    <div className="section3-caption">You don’t have to be an expert to gather people together and explore shared interests.</div>
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
