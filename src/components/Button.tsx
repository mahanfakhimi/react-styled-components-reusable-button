import { type MouseEvent, type ButtonHTMLAttributes, useState, memo, forwardRef } from "react";
import styled, { type RuleSet, keyframes, css } from "styled-components";

const variantStyles: Record<Variant, RuleSet> = {
  solid: css`
    --color: royalblue;
    --ripple-color: rgba(255, 255, 255, 0.4);

    background-color: var(--color);
    color: white;

    &:hover {
      background-color: color-mix(in srgb, var(--color), white 40%);
    }
  `,

  bordered: css`
    --color: royalblue;
    --ripple-color: color-mix(in srgb, var(--color), white 80%);

    border: 2px solid var(--color);
    color: var(--color);
    background: none;

    &:hover {
      --hover-color: color-mix(in srgb, var(--color), white 40%);

      border-color: var(--hover-color);
      color: var(--hover-color);
    }
  `,

  light: css`
    --color: royalblue;
    --ripple-color: color-mix(in srgb, var(--color), white 50%);

    color: var(--color);
    background: none;

    &:hover {
      background-color: color-mix(in srgb, var(--color), white 80%);
    }
  `,
};

const colorMap: Record<Color, string> = {
  primary: "royalblue",
  secondary: "purple",
  error: "red",
  success: "green",
};

const StyledButton = styled.button<{ $variant: Variant; $color: Color }>`
  color: white;
  cursor: pointer;
  padding: 1.5rem 6.5rem;
  border-radius: 20px;
  border: none;
  position: relative;
  overflow: hidden;
  transition: all 0.2s;

  ${({ $variant }) => variantStyles[$variant!]};

  ${({ $color }) => css`
    --color: ${colorMap[$color!]};
  `};
`;

const rippleAnimation = keyframes`
  to {
    scale: 4;
    opacity: 0;
  }
`;

const StyledRipple = styled.span`
  position: absolute;
  pointer-events: none;
  background-color: var(--ripple-color);
  border-radius: 50%;
  animation: ${rippleAnimation} 1s forwards;
  scale: 0;
`;

type Variant = "solid" | "bordered" | "light";
type Color = "primary" | "secondary" | "error" | "success";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  color?: Color;
};

type Ripple = { style: { top: string; left: string; width: string; height: string }; id: string };

const Ripple = memo(({ ripple, onAnimationEnd }: { ripple: Ripple; onAnimationEnd: (id: string) => void }) => {
  return <StyledRipple style={ripple.style} onAnimationEnd={() => onAnimationEnd(ripple.id)} />;
});

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "solid", color = "primary", ...props }, ref) => {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      const rect = (e.target as HTMLButtonElement).getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const top = `${e.nativeEvent.offsetY - size / 2}px`;
      const left = `${e.nativeEvent.offsetX - size / 2}px`;

      const id = crypto.randomUUID();

      setRipples((currRipples) => [...currRipples, { style: { top, left, width: `${size}px`, height: `${size}px` }, id }]);
    };

    const handleRippleAnimationEnd = (id: string) =>
      setRipples((currRipples) => currRipples.filter((ripple) => ripple.id !== id));

    return (
      <StyledButton $variant={variant} $color={color} onClick={handleClick} ref={ref} {...props}>
        {children}

        {ripples.map((ripple) => (
          <Ripple key={ripple.id} ripple={ripple} onAnimationEnd={handleRippleAnimationEnd} />
        ))}
      </StyledButton>
    );
  }
);

export default Button;
