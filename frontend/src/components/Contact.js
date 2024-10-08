import React from 'react';
import SOCIAL_PROFILES from '../data/socialProfiles';
import '../index.css';

const SocialProfile = (props) => {
  const { link, image } = props.socialProfile;

  return (
    <span>
      <a href={link}>
        <img
          src={image}
          alt="social-profile"
          style={{ width: 35, height: 35, margin: 10 }}
        />
      </a>
    </span>
  );
};

const SocialProfiles = () => (
  <div className="cherry-background">
    <h2>Connect with <span className="white-heading">me!</span></h2>
    <div>
      {SOCIAL_PROFILES.map((SOCIAL_PROFILE) => (
        <SocialProfile key={SOCIAL_PROFILE.id} socialProfile={SOCIAL_PROFILE} />
      ))}
    </div>
  </div>
);

export default SocialProfiles;
