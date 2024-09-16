import { RiGithubFill } from "react-icons/ri";
import { IconContext } from "react-icons";
import styles from "./Welcome.module.css";

export default function Welcome() {
  return (
    <>
      <h1 className={styles.siteTitle}>Cannoli</h1>
      <p>
        This is a fullstack portfolio project using the following:
      </p>
      <ul>
        <li>
          <a href="https://react.dev/" className={styles.link}>
            React
          </a>
        </li>
        <li>
          <a href="https://www.radix-ui.com/" className={styles.link}>
            Radix UI
          </a>
        </li>
        <li>
          <a href="https://www.djangoproject.com/" className={styles.link}>
            Django
          </a>
        </li>
        <li>
          <a
            href="https://www.django-rest-framework.org/"
            className={styles.link}
          >
            Django REST Framework
          </a>
        </li>
      </ul>
      <p>Please check the repo for more info.</p>
      <div className={styles.socialsContainer}>
        <a
          href="https://www.github.com/datle-dev/cannoli"
          class={styles.github}
        >
          <IconContext.Provider value={{ size: "36px" }}>
            <RiGithubFill />
            datle-dev/cannoli
          </IconContext.Provider>
        </a>
      </div>
    </>
  );
}
