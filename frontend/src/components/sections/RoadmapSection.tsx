'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

export const RoadmapSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const journeyTrackRef = useRef<HTMLDivElement>(null);

  // Scroll reveal observer
  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  // Journey track sequential dot activation
  useEffect(() => {
    const journeyTrack = journeyTrackRef.current;
    if (!journeyTrack) return;

    const steps = journeyTrack.querySelectorAll('.journey-step');
    const jio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            let i = 0;
            const interval = setInterval(() => {
              if (i >= steps.length) {
                clearInterval(interval);
                return;
              }
              steps[i].classList.add('on');
              i++;
            }, 260);
            jio.unobserve(journeyTrack);
          }
        });
      },
      { threshold: 0.4 }
    );

    jio.observe(journeyTrack);
    return () => jio.disconnect();
  }, []);

  // Roadmap active indicator on scroll
  useEffect(() => {
    const roadmapSteps = document.querySelectorAll('.roadmap-step');
    const targets = Array.from(roadmapSteps)
      .map((step) => {
        const id = (step as HTMLElement).dataset.target;
        return id ? document.getElementById(id) : null;
      })
      .filter(Boolean) as HTMLElement[];

    const updateRoadmapState = () => {
      const offset = window.innerHeight / 3;
      let activeIndex = 0;

      targets.forEach((target, index) => {
        const rect = target.getBoundingClientRect();
        if (rect.top - offset <= 0) {
          activeIndex = index;
        }
      });

      roadmapSteps.forEach((step, index) => {
        step.classList.toggle('active', index === activeIndex);
      });
    };

    window.addEventListener('scroll', updateRoadmapState, { passive: true });
    updateRoadmapState();

    return () => window.removeEventListener('scroll', updateRoadmapState);
  }, []);

  return (
    <div className="roadmap-shell" ref={containerRef}>
      <aside className="roadmap-guide reveal">
        <div className="roadmap-label">Roadmap</div>
        <div className="roadmap-scroll-wrap">
          <button className="roadmap-scroll-btn left" aria-label="Scroll roadmap left">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <ul className="roadmap-list">
            <li>
              <a className="roadmap-step active" href="#messages" data-target="messages">
                Where it lives
              </a>
            </li>
            <li>
              <a className="roadmap-step" href="#how-it-works" data-target="how-it-works">
                How it works
              </a>
            </li>
            <li>
              <a className="roadmap-step" href="#journey" data-target="journey">
                Follow through
              </a>
            </li>
            <li>
              <a className="roadmap-step" href="#for-you" data-target="for-you">
                Who it's for
              </a>
            </li>
            <li>
              <a className="roadmap-step" href="#about" data-target="about">
                Anywhere you talk
              </a>
            </li>
          </ul>
          <button className="roadmap-scroll-btn right" aria-label="Scroll roadmap right">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
            </svg>
          </button>
        </div>
      </aside>

      <div className="roadmap-content">
        {/* MESSAGES / THE PROBLEM */}
        <section className="section-border-top" id="messages">
          <div className="wrap center">
            <p className="eyebrow reveal">The problem</p>
            <h2 className="display-l reveal max-text mx-auto" style={{ marginTop: '16px' }}>
              You Have Too Much to Remember.
            </h2>
            <p className="lead reveal max-text mx-auto" style={{ marginTop: '20px' }}>
              Your meetings. Your deadlines. Your goals. Your promises. The little things you keep telling yourself you'll do later.
            </p>
            <p className="lead reveal max-text mx-auto" style={{ marginTop: '12px' }}>
              So you make lists. Set reminders. Add calendar events. And somehow, you still forget.
            </p>
            <p className="lead reveal max-text mx-auto" style={{ marginTop: '12px', fontWeight: 700 }}>
              You need someone to remember them with you.
            </p>
          </div>
          <div className="platform-strip reveal" style={{ marginTop: '56px' }}>
            <span>WhatsApp</span>
            <span>Telegram</span>
          </div>
        </section>

        {/* HOW IT WORKS / MEET HEVN */}
        <section className="section-border-top" id="how-it-works">
          <div className="wrap story-grid">
            <div className="reveal">
              <p className="eyebrow">Meet Hevn</p>
              <h2 className="display-m" style={{ marginTop: '14px' }}>
                Meet Hevn.
              </h2>
              <p className="body-copy" style={{ marginTop: '20px' }}>
                Your AI secretary, right inside your chats. Just tell Hevn what you need to do. Hevn remembers, keeps track of what's coming, and reminds you when it matters.
              </p>
              <p className="body-copy" style={{ marginTop: '12px', fontWeight: 700 }}>
                No dashboards. No complicated systems. Just talk.
              </p>
            </div>
            <div className="device reveal reveal-delay-1">
              <div className="device-head">
                <div className="device-mark">
                  <Image className="logo-img-device" src="/images/logo.png" alt="Hevn" width={40} height={40} />
                </div>
                <div>
                  <div className="device-name">Hevn</div>
                  <div className="device-sub">AI Secretary · Telegram</div>
                </div>
              </div>
              <div className="device-body">
                <div className="bubble from-user" style={{ animationDelay: '0.1s' }}>
                  Remind me to send the proposal to Sarah tomorrow at 10.
                </div>
                <div className="bubble from-hevn" style={{ animationDelay: '0.5s' }}>
                  Got it. I'll remind you tomorrow at 10 AM. Would you like me to check in if it isn't done?
                </div>
                <div className="bubble from-user" style={{ animationDelay: '0.9s' }}>
                  Yes.
                </div>
                <div className="bubble from-hevn" style={{ animationDelay: '1.3s' }}>
                  Consider it handled.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* JOURNEY / INTENTION TO COMPLETION */}
        <section className="section-border-top" id="journey">
          <div className="wrap center">
            <p className="eyebrow reveal">How it works</p>
            <h2 className="display-l reveal max-text mx-auto" style={{ marginTop: '16px' }}>
              Tell Hevn. Hevn remembers. Hevn reminds.
            </h2>
            <p className="lead reveal max-text mx-auto" style={{ marginTop: '20px' }}>
              “Remind me to study Tuesday. I have an exam Thursday.”
            </p>
            <p className="lead reveal max-text mx-auto" style={{ marginTop: '12px' }}>
              Your plans, deadlines and commitments stay on track. Before the thing becomes the thing you forgot, Hevn nudges you — so you do it.
            </p>
          </div>
          <div className="wrap">
            <div className="journey reveal" id="journeyTrack" ref={journeyTrackRef}>
              <div className="journey-step" data-step="0">
                <div className="journey-dot"></div>
                <div className="journey-label">Say it</div>
              </div>
              <div className="journey-line"></div>
              <div className="journey-step" data-step="1">
                <div className="journey-dot"></div>
                <div className="journey-label">Plan it</div>
              </div>
              <div className="journey-line"></div>
              <div className="journey-step" data-step="2">
                <div className="journey-dot"></div>
                <div className="journey-label">Remember it</div>
              </div>
              <div className="journey-line"></div>
              <div className="journey-step" data-step="3">
                <div className="journey-dot"></div>
                <div className="journey-label">Do it</div>
              </div>
              <div className="journey-line"></div>
              <div className="journey-step" data-step="4">
                <div className="journey-dot"></div>
                <div className="journey-label">Done</div>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCTIVITY PARADISE MANIFESTO */}
        <section className="manifesto">
          <div className="wrap center">
            <p className="eyebrow reveal">The positioning</p>
            <h2 className="display-l reveal" style={{ marginTop: '16px', color: 'var(--white)' }}>
              Welcome to your productivity paradise.
            </h2>
            <div className="manifesto-lines reveal">
              <div>Nothing <span>forgotten.</span></div>
              <div>Nothing <span>scattered.</span></div>
              <div>Nothing unnecessarily <span>complicated.</span></div>
            </div>
            <p className="lead reveal max-text mx-auto">
              Hevn quietly keeps track of the things competing for your attention so you don't have to.
            </p>
          </div>
        </section>

        {/* ROLE BASED EXPERIENCE */}
        <section className="section-border-top" id="for-you">
          <div className="wrap center">
            <p className="eyebrow reveal">Whatever You’re Trying to Keep Up With</p>
            <h2 className="display-l reveal max-text mx-auto" style={{ marginTop: '16px' }}>
              Whatever you’re trying to keep up with.
            </h2>
          </div>
          <div className="wrap">
            <div className="roles-grid">
              <div className="role-card reveal">
                <div className="role-num">Student</div>
                <div className="role-title">Assignments. Exams. Projects.</div>
                <p className="role-desc">
                  Classes, assignments and study plans — Hevn keeps academic life on track.
                </p>
              </div>
              <div className="role-card reveal reveal-delay-1">
                <div className="role-num">Professional</div>
                <div className="role-title">Meetings. Deadlines. Follow-ups.</div>
                <p className="role-desc">Hevn helps you stay ahead at work.</p>
              </div>
              <div className="role-card reveal reveal-delay-2">
                <div className="role-num">Executive</div>
                <div className="role-title">People. Priorities. Decisions.</div>
                <p className="role-desc">
                  Keep teams and priorities coordinated without extra busywork.
                </p>
              </div>
              <div className="role-card reveal reveal-delay-3">
                <div className="role-num">Life</div>
                <div className="role-title">Household. Errands. Personal goals.</div>
                <p className="role-desc">Because sometimes life itself is the task.</p>
              </div>
            </div>
            <p className="roles-more reveal">Three, four, or more — whatever you need.</p>
          </div>
        </section>

        {/* STUDENT EXPERIENCE STORY */}
        <section className="section-border-top">
          <div className="wrap story-grid">
            <div
              className="photo story-photo reveal"
              style={{
                backgroundImage: `url('https://i.pinimg.com/736x/b8/6d/e9/b86de9c9f8c9a4d0a1fba0368d106b05.jpg')`,
              }}
              role="img"
              aria-label="Student study desk"
            ></div>
            <div className="reveal reveal-delay-1">
              <p className="eyebrow">Student</p>
              <h2 className="display-m" style={{ marginTop: '14px' }}>
                Two weeks out. Zero pages read.
              </h2>
              <div className="device" style={{ marginTop: '26px' }}>
                <div className="device-head">
                  <div className="device-mark">
                    <Image className="logo-img-device" src="/images/logo.png" alt="Hevn" width={40} height={40} />
                  </div>
                  <div>
                    <div className="device-name">Hevn</div>
                    <div className="device-sub">AI Secretary</div>
                  </div>
                </div>
                <div className="device-body">
                  <div className="bubble from-user">I have an exam in two weeks and I haven't started studying.</div>
                  <div className="bubble from-hevn">Let's fix that. What materials do you have?</div>
                  <div className="bubble from-user">These lecture notes.</div>
                  <div className="bubble from-hevn">
                    Perfect. I've created a study plan around your exam date. Want to test yourself on Chapter 1?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EXECUTIVE ASSISTANT STORY */}
        <section className="section-border-top">
          <div className="wrap story-grid">
            <div className="reveal" style={{ order: 2 }}>
              <p className="eyebrow">Executive Assistant</p>
              <h2 className="display-m" style={{ marginTop: '14px' }}>
                Before the day gets away from you.
              </h2>
              <div className="device" style={{ marginTop: '26px' }}>
                <div className="device-head">
                  <div className="device-mark">
                    <Image className="logo-img-device" src="/images/logo.png" alt="Hevn" width={40} height={40} />
                  </div>
                  <div>
                    <div className="device-name">Hevn</div>
                    <div className="device-sub">AI Secretary</div>
                  </div>
                </div>
                <div className="device-body">
                  <div className="bubble from-user">What still needs my attention today?</div>
                  <div className="bubble from-hevn">
                    <div className="agenda-list">
                      <div className="agenda-row">
                        <span>Confirm John's meeting</span>
                        <span className="agenda-time">11:00</span>
                      </div>
                      <div className="agenda-row">
                        <span>Send the revised proposal</span>
                        <span className="agenda-time">14:00</span>
                      </div>
                      <div className="agenda-row">
                        <span>Follow up with Sarah</span>
                        <span className="agenda-time">overdue</span>
                      </div>
                    </div>
                  </div>
                  <div className="bubble from-hevn">
                    Your 3 PM meeting hasn't been prepared yet. Want me to create a quick prep checklist?
                  </div>
                </div>
              </div>
            </div>
            <div
              className="photo story-photo reveal reveal-delay-1"
              style={{
                order: 1,
                backgroundImage: `url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80')`,
              }}
              role="img"
              aria-label="Executive desk setup"
            ></div>
          </div>
        </section>

        {/* PROACTIVE ASSISTANCE BACKGROUND */}
        <section className="section-photo-bg">
          <Image
            className="bg-img"
            src="/images/chaos-multitask.png"
            alt="Overhead view of someone asleep at a cluttered desk"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
          <div className="wrap center">
            <p className="eyebrow reveal">The distinction</p>
            <h2 className="display-l reveal" style={{ marginTop: '16px' }}>
              Most tools wait for you.<br />Hevn doesn't.
            </h2>
          </div>
          <div className="wrap">
            <div className="contrast-grid">
              <div className="contrast-card old reveal">
                <div className="contrast-label">A reminder</div>
                <div className="contrast-msg">Your report is due tomorrow.</div>
              </div>
              <div className="contrast-card new reveal reveal-delay-1">
                <div className="contrast-label">Hevn</div>
                <div className="contrast-msg">
                  Your report is due tomorrow. You haven't started the final review yet. Want me to help you break it down?
                </div>
              </div>
            </div>
            <div className="flow-track reveal">
              <span>Reminder</span>
              <span>→</span>
              <span>Assistant</span>
              <span>→</span>
              <span className="active">Secretary</span>
            </div>
            <div className="quiet-merge reveal" style={{ marginTop: '32px' }}>
              <div className="quiet-merge-inner">
                <p className="eyebrow">The experience</p>
                <h2 className="display-l" style={{ marginTop: '16px' }}>
                  Less noise. More done.
                </h2>
                <div className="quiet-list max-text mx-auto" style={{ marginTop: '24px' }}>
                  <div><b>No</b> unnecessary notifications.</div>
                  <div><b>No</b> complicated dashboards.</div>
                  <div><b>No</b> endless settings.</div>
                  <div><b>No</b> productivity theater.</div>
                  <div style={{ color: 'rgba(250, 246, 238, 0.92)', fontWeight: 500, marginTop: '6px' }}>
                    Just the right information, at the right time.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHERE HEVN LIVES */}
        <section className="section-border-top" id="about">
          <div className="wrap center">
            <p className="eyebrow reveal">Wherever you already talk</p>
            <h2 className="display-l reveal" style={{ marginTop: '16px' }}>
              Wherever you already talk.
            </h2>
          </div>
          <div className="wrap">
            <div className="live-grid">
              <div className="live-card reveal">
                <h3>WhatsApp</h3>
                <p>Your everyday conversations, now with an AI Secretary.</p>
              </div>
              <div className="live-card reveal reveal-delay-1">
                <h3>Telegram</h3>
                <p>
                  Your communities, messages, and responsibilities — with Hevn keeping track.
                </p>
              </div>
            </div>
            <div className="proof-inline reveal" style={{ marginTop: '40px', textAlign: 'center' }}>
              <div className="proof-badge">Build with Gemma · GDGoC BUK</div>
              <h2 className="display-m" style={{ marginTop: '18px' }}>Competition Winner</h2>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
