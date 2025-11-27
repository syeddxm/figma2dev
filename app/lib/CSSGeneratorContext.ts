import { createContext } from "react";
import { CSSGenerator } from "./CSSGenerator";

export const CssGeneratorContext = createContext<CSSGenerator>(new CSSGenerator());