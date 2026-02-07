/** @jsxImportSource @emotion/react */
'use client';
import { Interpolation, Theme } from '@emotion/react';
import gsap from 'gsap';
import { useEffect, useMemo, useRef } from 'react';
import * as styles from './Strings.styles';
import {
  DESKTOP_PIN_CONFIGS,
  MOBILE_PIN_CONFIGS,
  PERSISTENT_STRING_CONFIGS,
} from './utils/stringsConfig';

type Config = {
  strings: {
    count: number;
    lineWidth: number;
    opacity: {
      min: number;
      max: number;
      centerBoost: number;
    };
  };
  distribution: {
    clusterExponent: number;
    ySpread: number;
    xSpreadPercent: number;
    randomYOffset: number;
  };
  dots: {
    enabled: boolean;
    withLabelsCount: number;
    withoutLabelsPercent: number;
    radius: number;
    color: string;
    positionRange: {
      min: number;
      max: number;
    };
    assignLabelsToFarthest: boolean;
  };
  labels: {
    enabled: boolean;
    font: string;
    color: string;
    offsetY: number;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
  };
  animation: {
    wave: {
      amplitudeY: { min: number; max: number };
      amplitudeX: { min: number; max: number };
      duration: { min: number; max: number };
      delay: number;
      ease: string;
    };
    hover: {
      hoverRadius: number;
      scaleAmount: number;
      duration: number;
      ease: string;
    };
  };
  colors: string[];
  labelTexts: string[];
};
/**
 * Configuration object for the Strings component.
 * Controls the visual, behavioral, and animation aspects of the bezier strings and dots.
 */
const CONFIG: Config = {
  strings: {
    count: 60,
    lineWidth: 1,
    opacity: {
      min: 1,
      max: 1,
      centerBoost: 1,
    },
  },
  distribution: {
    clusterExponent: 2,
    ySpread: 3.5,
    xSpreadPercent: 0.7,
    randomYOffset: 200,
  },
  dots: {
    enabled: true,
    withLabelsCount: 5,
    withoutLabelsPercent: 0.15,
    radius: 3,
    color: '#000000',
    positionRange: {
      min: 0.3,
      max: 0.85,
    },
    assignLabelsToFarthest: true,
  },
  labels: {
    enabled: true,
    font: '10px monospace, sans-serif',
    color: '#000000',
    offsetY: 10,
    textAlign: 'center' as CanvasTextAlign,
    textBaseline: 'bottom' as CanvasTextBaseline,
  },
  animation: {
    wave: {
      amplitudeY: { min: 30, max: 80 },
      amplitudeX: { min: 60, max: 140 },
      duration: { min: 1.5, max: 3.5 },
      delay: 0.02,
      ease: 'sine.inOut',
    },
    hover: {
      hoverRadius: 80,
      scaleAmount: 1.3,
      duration: 0.3,
      ease: 'power2.out',
    },
  },
  colors: ['#CAC200', '#FFB675', '#FFBB00', '#63C700', '#74D0A2'],
  labelTexts: [
    'WEB, DNS, AND CONTROL PLAN',
    'CERTIFICATIONS',
    'AUDIT FIRM REPUTATION',
    'REGULATORY SURFACE CONTROLS',
    'L2 / DA / SEQUENCER DEPENDENCIES',
  ],
} as const;

const DOT_LABELS = CONFIG.labelTexts;

/**
 * Properties for the Strings component.
 */
export interface StringsProps {
  /** Optional class name for the canvas container */
  className?: string;

  /** Additional CSS via Emotion for the canvas container */
  css?: Interpolation<Theme>;

  /** Default vertical center as a fraction [0, 1]. */
  defaultCenterY?: number;

  /** Default horizontal center as a fraction [0, 1]. */
  defaultCenterX?: number;

  /** Offset for the center Y position. */
  defaultCenterOffset?: number;

  /** Number of bezier strings to render. */
  stringCount?: number;

  /** Optional configuration override. */
  config?: Partial<{ [K in keyof Config]: Partial<Config[K]> }>;
}

/**
 * Per-string data (control point, color, dot, animation, label) for rendering and animation.
 */
interface StringData {
  id: number;
  color: string;
  opacity: number;
  startY: number;
  endY: number;
  controlPoint: { x: number; y: number };
  defaultControlPoint: { x: number; y: number };
  animation: gsap.core.Tween | gsap.core.Timeline | null;
  hasDot: boolean;
  dotT?: number;
  label?: string;
  scale: number;
  scaleAnimation?: gsap.core.Tween;
}

/**
 * Initializes and returns an infinite yoyo GSAP animation (Tween) on the
 * provided StringData's controlPoint object for idle wave effect.
 * @param string - The string data object whose control point to animate.
 * @param targetX - The destination X for the control point.
 * @param targetY - The destination Y for the control point.
 * @param waveDuration - Duration of the animation cycle.
 * @param delay - Initial delay for staggering.
 * @returns GSAP Tween instance.
 */
const idleAnimation = (
  string: StringData,
  targetX: number,
  targetY: number,
  waveDuration: number,
  delay: number
) => {
  return gsap.to(string.controlPoint, {
    x: targetX,
    y: targetY,
    duration: waveDuration,
    delay,
    ease: CONFIG.animation.wave.ease,
    repeat: -1,
    yoyo: true,
  });
};

/**
 * Animated Bezier Strings visualization component.<br>
 * Renders a set of animated bezier curves ("strings") with wave motion in a canvas.
 * Dots may be shown along selected strings, optionally labeled.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {number} [props.defaultCenterY=0.5] - Default center Y position (fraction of height).
 * @param {number} [props.defaultCenterX=0.5] - Default control point X position (fraction of width).
 * @param {number} [props.defaultCenterOffset=0] - Vertical offset for the center Y.
 * @param {number} [props.stringCount=CONFIG.strings.count] - Number of bezier strings to render.
 * @param {Interpolation<Theme>} [props.css] - Additional css for the canvas element via Emotion.
 * @param {string} [props.className] - Additional class name for the canvas element.
 * @param {typeof CONFIG} [props.config] - Optional config override.
 * @returns {JSX.Element}
 */
const Strings = ({
  defaultCenterY = 0.5,
  defaultCenterX = 0.5,
  defaultCenterOffset = 0,
  stringCount = CONFIG.strings.count,
  css,
  config: configProps = CONFIG,
  className,
}: StringsProps = {}) => {
  const config = useMemo<Config>(
    () => ({
      strings: { ...CONFIG.strings, ...configProps.strings },
      distribution: { ...CONFIG.distribution, ...configProps.distribution },
      dots: { ...CONFIG.dots, ...configProps.dots },
      labels: { ...CONFIG.labels, ...configProps.labels },
      animation: { ...CONFIG.animation, ...configProps.animation },
      colors: [...CONFIG.colors, ...(configProps.colors || [])] as string[],
      labelTexts: [...CONFIG.labelTexts, ...(configProps.labelTexts || [])] as string[],
    }),
    [configProps]
  );
  /** Canvas DOM reference */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /** Array of string data currently drawn and animated */
  const stringsRef = useRef<StringData[]>([]);

  /** Current bounding rect of the canvas (CSS size) */
  const canvasRectRef = useRef({ width: 0, height: 0 });

  /** References to active idle (wave) animations */
  const idleAnimationsRef = useRef<(gsap.core.Tween | null)[]>([]);

  /** Current mouse position relative to canvas */
  const mousePositionRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /**
     * Calculates the actual position of a dot on a bezier curve.
     */
    const calculateDotPosition = (
      string: StringData,
      t: number,
      canvasWidth: number
    ): { x: number; y: number } => {
      const { startY, endY, controlPoint } = string;
      const startX = 0;
      const endX = canvasWidth;
      const leftControlX = canvasWidth * 0.25;
      const leftControlY = startY;

      const curvePointX =
        Math.pow(1 - t, 3) * startX +
        3 * Math.pow(1 - t, 2) * t * leftControlX +
        3 * (1 - t) * Math.pow(t, 2) * controlPoint.x +
        Math.pow(t, 3) * endX;
      const curvePointY =
        Math.pow(1 - t, 3) * startY +
        3 * Math.pow(1 - t, 2) * t * leftControlY +
        3 * (1 - t) * Math.pow(t, 2) * controlPoint.y +
        Math.pow(t, 3) * endY;

      return { x: curvePointX, y: curvePointY };
    };

    /**
     * Draws all bezier strings and optional dots/labels onto the canvas.
     * Called on each GSAP ticker tick (requestAnimationFrame).
     */
    const drawAllStrings = () => {
      const canvasWidth = canvasRectRef.current.width;
      const canvasHeight = canvasRectRef.current.height;

      if (canvasWidth <= 0 || canvasHeight <= 0) return;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Draw all strings
      stringsRef.current.forEach((string, _index) => {
        const { color, opacity, startY, endY, controlPoint } = string;
        if (!isFinite(controlPoint.x) || !isFinite(controlPoint.y)) return;

        const startX = 0;
        const endX = canvasWidth;
        const leftControlX = canvasWidth * 0.25;
        const leftControlY = startY;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(leftControlX, leftControlY, controlPoint.x, controlPoint.y, endX, endY);
        ctx.lineWidth = config.strings.lineWidth;
        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // Draw dots and optional labels
      if (config.dots.enabled) {
        stringsRef.current.forEach((string) => {
          if (string.hasDot && string.dotT !== undefined) {
            // Calculate dot position on the curve using helper
            const curvePoint = calculateDotPosition(string, string.dotT, canvasWidth);

            // Draw dot with scale
            ctx.beginPath();
            ctx.arc(curvePoint.x, curvePoint.y, config.dots.radius * string.scale, 0, Math.PI * 2);
            ctx.fillStyle = config.dots.color;
            ctx.fill();

            // Draw label (if present) with scale
            if (config.labels.enabled && string.label) {
              const baseFontSize = 10;
              const scaledFontSize = baseFontSize * string.scale;
              ctx.font = `${scaledFontSize}px monospace, sans-serif`;
              ctx.fillStyle = config.labels.color;
              ctx.textAlign = config.labels.textAlign;
              ctx.textBaseline = config.labels.textBaseline;
              ctx.fillText(
                string.label,
                curvePoint.x,
                curvePoint.y - config.labels.offsetY * string.scale
              );
            }
          }
        });
      }
    };

    /**
     * Checks mouse proximity to dots and animates their scale.
     * Called on mouse move to create hover effects.
     */
    const handleDotHover = () => {
      const mousePos = mousePositionRef.current;
      if (!mousePos) return;

      const canvasWidth = canvasRectRef.current.width;
      const hoverRadius = config.animation.hover.hoverRadius;

      stringsRef.current.forEach((string) => {
        if (string.hasDot && string.dotT !== undefined) {
          // Calculate dot position on the curve using helper
          const curvePoint = calculateDotPosition(string, string.dotT, canvasWidth);

          // Calculate distance from mouse to dot
          const dx = mousePos.x - curvePoint.x;
          const dy = mousePos.y - curvePoint.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Determine target scale based on proximity
          const targetScale = distance < hoverRadius ? config.animation.hover.scaleAmount : 1;

          // Animate scale if it needs to change
          if (Math.abs(string.scale - targetScale) > 0.01) {
            // Kill existing scale animation if any
            if (string.scaleAnimation) {
              string.scaleAnimation.kill();
            }

            // Create new scale animation
            string.scaleAnimation = gsap.to(string, {
              scale: targetScale,
              duration: config.animation.hover.duration,
              ease: config.animation.hover.ease,
              overwrite: true,
            });
          }
        }
      });
    };

    /**
     * Populates and initializes the StringData array.
     * Dots & labels are assigned as per pre-generated constants.
     *
     * @param width  - canvas width (CSS px)
     * @param height - canvas height (CSS px)
     */
    const initializeStrings = (width: number, height: number) => {
      const centerY = height * defaultCenterY;
      const controlX = width * defaultCenterX;

      // Kill existing animations for old strings before replacement
      stringsRef.current.forEach((string) => {
        if (string.animation) {
          string.animation.kill();
        }
        if (string.scaleAnimation) {
          string.scaleAnimation.kill();
        }
      });

      const bundleStartY = centerY;
      const bundleEndY = centerY;

      // Detect mobile screens
      const isMobile = width < 768;

      // Select appropriate pin configuration based on screen size
      const pinConfigs = isMobile ? MOBILE_PIN_CONFIGS : DESKTOP_PIN_CONFIGS;

      // Create all strings using pre-generated persistent configuration
      stringsRef.current = Array.from({ length: stringCount }, (_, index) => {
        const stringConfig = PERSISTENT_STRING_CONFIGS[index];
        const normalizedIndex = index / (stringCount - 1) - 0.5;
        const clusterFactor =
          Math.pow(Math.abs(normalizedIndex), config.distribution.clusterExponent) *
          Math.sign(normalizedIndex);
        const ySpread = height * config.distribution.ySpread;
        const baseControlY = centerY + clusterFactor * ySpread;
        const finalDefaultY = baseControlY + stringConfig.randomYOffset + defaultCenterOffset;
        const finalDefaultX = controlX + stringConfig.xVariation * width;

        return {
          id: index,
          color: stringConfig.color,
          opacity: stringConfig.opacity,
          startY: bundleStartY,
          endY: bundleEndY,
          controlPoint: { x: finalDefaultX, y: finalDefaultY },
          defaultControlPoint: { x: finalDefaultX, y: finalDefaultY },
          animation: null,
          hasDot: false,
          dotT: undefined,
          label: undefined,
          scale: 1,
          scaleAnimation: undefined,
        };
      });

      // Apply pins to strings based on screen size
      pinConfigs.forEach((pin, index) => {
        const string = stringsRef.current[pin.stringIndex];
        if (string) {
          string.hasDot = true;
          string.dotT = pin.dotT;
          // Assign labels to the first 5 pins (they were designed for labels)
          if (index < config.dots.withLabelsCount && index < DOT_LABELS.length) {
            string.label = DOT_LABELS[index];
          }
        }
      });

      initializeIdleAnimations();
    };

    /**
     * Creates GSAP idle (waving) animations for all control points.
     * Existing animations are killed before new ones start.
     */
    const initializeIdleAnimations = () => {
      idleAnimationsRef.current.forEach((anim) => anim?.kill());
      idleAnimationsRef.current = [];

      stringsRef.current.forEach((string, index) => {
        const waveAmplitudeY =
          config.animation.wave.amplitudeY.min +
          Math.random() *
            (config.animation.wave.amplitudeY.max - config.animation.wave.amplitudeY.min);
        const waveAmplitudeX =
          config.animation.wave.amplitudeX.min +
          Math.random() *
            (config.animation.wave.amplitudeX.max - config.animation.wave.amplitudeX.min);
        const waveDuration =
          config.animation.wave.duration.min +
          Math.random() * (config.animation.wave.duration.max - config.animation.wave.duration.min);
        const delay = index * config.animation.wave.delay;
        const targetY = string.defaultControlPoint.y + (Math.random() - 0.5) * waveAmplitudeY * 2;
        const targetX = string.defaultControlPoint.x + (Math.random() - 0.5) * waveAmplitudeX * 2;
        const idleAnim = idleAnimation(string, targetX, targetY, waveDuration, delay);
        idleAnimationsRef.current[string.id] = idleAnim;
      });
    };

    /**
     * Handles resizing of the canvas.
     * Adjusts for device pixel ratio, updates size and position state, and reinitializes string layout.
     */
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      // Save CSS pixels for logic
      canvasRectRef.current = {
        width: rect.width,
        height: rect.height,
      };

      // Physical pixel size for sharp rendering
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      initializeStrings(rect.width, rect.height);
    };

    /**
     * Handles mouse move events to track cursor position.
     */
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePositionRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      handleDotHover();
    };

    /**
     * Handles mouse leave events to reset all scales.
     */
    const handleMouseLeave = () => {
      mousePositionRef.current = null;
      // Reset all scales when mouse leaves
      stringsRef.current.forEach((string) => {
        if (string.hasDot && string.scale !== 1) {
          if (string.scaleAnimation) {
            string.scaleAnimation.kill();
          }
          string.scaleAnimation = gsap.to(string, {
            scale: 1,
            duration: config.animation.hover.duration,
            ease: config.animation.hover.ease,
          });
        }
      });
    };

    // Initial layout/resize and listeners
    resizeCanvas();
    gsap.ticker.add(drawAllStrings);
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      gsap.ticker.remove(drawAllStrings);
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      stringsRef.current.forEach((string) => {
        if (string.animation) {
          string.animation.kill();
        }
        if (string.scaleAnimation) {
          string.scaleAnimation.kill();
        }
      });
      idleAnimationsRef.current.forEach((anim) => anim?.kill());
    };
  }, [defaultCenterX, defaultCenterY, defaultCenterOffset, stringCount, config]);

  return (
    <div className={className} css={[styles.container, css]}>
      <canvas css={styles.canvas} ref={canvasRef} />
    </div>
  );
};

export default Strings;
