import type { ComponentType } from "react";
import type { PhoneInputProps } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import RPI from "react-phone-input-2";

/** Vite may resolve react-phone-input-2 as `{ default: { default: Component } }`. */
const PhoneInputField =
  typeof RPI === "function"
    ? RPI
    : (RPI as { default: ComponentType<PhoneInputProps> }).default;

export default PhoneInputField;
export type { PhoneInputProps };
