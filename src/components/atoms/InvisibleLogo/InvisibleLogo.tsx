import type { FunctionalComponent } from "preact";
import { useEffect, useRef } from "preact/hooks";

import Gl from "./scripts";

import styles from "./InvisibleLogo.module.scss";

const InvisibleLogo: FunctionalComponent = () => {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let instance: Gl;

    if (elementRef.current) {
      instance = new Gl(elementRef.current);
    }

    return () => {
      if (elementRef.current && instance) {
        instance.destroy();
      }
    };
  }, [elementRef.current]);

  return <div ref={elementRef} className={styles.InvisibleLogo} />;
};

export default InvisibleLogo;
