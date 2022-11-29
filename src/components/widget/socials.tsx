import {
  discord,
  facebook,
  medium,
  reddit,
  telegram,
  twitter,
  youtube,
} from '../../assets/icons/socials';

const Socials = () => {
  return (
    <div className="flex items-center justify-between">
      <a
        className="w-fit"
        href="https://www.twitter.com"
        target="_blank"
        rel="noreferrer"
      >
        <img className="w-4 h-4" src={twitter} alt="twitter icon" />
      </a>
      <a
        className="w-fit"
        href="https://www.facebook.com"
        target="_blank"
        rel="noreferrer"
      >
        <img className="w-4 h-4" src={facebook} alt="facebook icon" />
      </a>
      <a
        className="w-fit"
        href="https://www.discord.com"
        target="_blank"
        rel="noreferrer"
      >
        <img className="w-4 h-4" src={discord} alt="discord icon" />
      </a>
      <a
        className="w-fit"
        href="https://www.telegram.com"
        target="_blank"
        rel="noreferrer"
      >
        <img className="w-4 h-4" src={telegram} alt="telegram icon" />
      </a>
      <a
        className="w-fit"
        href="https://www.youtube.com"
        target="_blank"
        rel="noreferrer"
      >
        <img className="w-4 h-4" src={youtube} alt="youtube icon" />
      </a>
      <a
        className="w-fit"
        href="https://www.medium.com"
        target="_blank"
        rel="noreferrer"
      >
        <img className="w-4 h-4" src={medium} alt="medium icon" />
      </a>
      <a
        className="w-fit"
        href="https://www.reddit.com"
        target="_blank"
        rel="noreferrer"
      >
        <img className="w-4 h-4" src={reddit} alt="reddit icon" />
      </a>
    </div>
  );
};

export default Socials;
