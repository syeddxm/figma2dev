import { describe, it, expect, beforeEach } from '@jest/globals';
import { FrameNode, Paint } from '@figma/rest-api-spec';
import { CSSGenerator } from '~/lib/CSSGenerator';

describe('CSSGenerator', () => {
  let generator: CSSGenerator;

  beforeEach(() => {
    generator = new CSSGenerator();
  });

  describe('addBackgroundColor', () => {
    it('should add background color for RGB', () => {
      const color = { r: 1, g: 0, b: 0 };
      const className = generator.addBackgroundColor(color);

      expect(className).toContain('bg-color-');
      const css = generator.getCss();
      expect(css.background.get(className)).toBe('rgb(255, 0, 0)');
    });

    it('should add background color for RGBA', () => {
      const color = { r: 0, g: 0, b: 1, a: 0.5 };
      const className = generator.addBackgroundColor(color);

      const css = generator.getCss();
      expect(css.background.get(className)).toBe('rgba(0, 0, 255, 0.5)');
    });
  });

  describe('addTextColorFromFill', () => {
    it('should add text color from solid fill', () => {
      const fills: Paint[] = [
        {
          type: "SOLID" as const,
          color: { r: 0, g: 1, b: 0, a: 1 },
          blendMode: 'NORMAL',
        },
      ];
      const className = generator.addTextColorFromFill(fills);

      expect(className).toContain('color-');
      const css = generator.getCss();
      expect(css.color.size).toBeGreaterThan(0);
    });
  });

  describe('addStrokes', () => {
    it('should add border from solid stroke', () => {
      const strokes: FrameNode["strokes"] = [
        { type: "SOLID" as const, color: { r: 0, g: 0, b: 0, a: 1 }, blendMode: 'NORMAL' },
      ];
      const className = generator.addStrokes(strokes, 2);

      expect(className).toContain('border-');
      const css = generator.getCss();
      expect(css.border.size).toBeGreaterThan(0);
    });
  });

  describe('addCornerRadius', () => {
    it('should add corner radius', () => {
      const className = generator.addCornerRadius(10);

      expect(className).toBe('border-radius-10px');
      const css = generator.getCss();
      expect(css['border-radius'].get(className)).toBe('10px');
    });
  });

  describe('addOpacity', () => {
    it('should add opacity', () => {
      const className = generator.addOpacity(0.75);

      expect(className).toBe('opacity-0-75');
      const css = generator.getCss();
      expect(css.opacity.get(className)).toBe('0.75');
    });

    it('should return empty string for full opacity', () => {
      const className = generator.addOpacity(1);

      expect(className).toBe('');
    });
  });

  describe('addPadding', () => {
    it('should add padding', () => {
      const className = generator.addPadding(10, 20, 10, 20);

      expect(className).toContain('padding-');
      const css = generator.getCss();
      expect(css.padding.get(className)).toBe('20px 10px 20px 10px');
    });
  });

  describe('addFlex', () => {
    it('should add horizontal flex', () => {
      const className = generator.addFlex('HORIZONTAL');

      expect(className).toBe('flex-horizontal');
      const css = generator.getCss();
      const style = css.flex.get(className) as Record<string, string>;
      expect(style.display).toBe('flex');
      expect(style['flex-direction']).toBe('row');
    });

    it('should add vertical flex', () => {
      const className = generator.addFlex('VERTICAL');

      expect(className).toBe('flex-vertical');
      const css = generator.getCss();
      const style = css.flex.get(className) as Record<string, string>;
      expect(style['flex-direction']).toBe('column');
    });
  });

  describe('addDimensions', () => {
    it('should add width and height', () => {
      const className = generator.addDimensions(100, 200);

      expect(className).toContain('width-100px height-200px');
      const css = generator.getCss();
      expect(css.width.get('width-100px')).toBe('100px');
      expect(css.height.get('height-200px')).toBe('200px');
    });
  });

  describe('addFontStyle', () => {
    it('should add font style', () => {
      const textStyle = {
        fontFamily: 'Arial',
        fontWeight: 400,
        fontSize: 16,
      };
      const className = generator.addFontStyle(textStyle);

      expect(className).toContain('text-');
      const css = generator.getCss();
      const style = css.textStyle.get(className) as Record<string, string>;
      expect(style['font-family']).toBe('Arial');
      expect(style['font-weight']).toBe('400');
      expect(style['font-size']).toBe('16px');
    });
  });

  describe('addPosition', () => {
    it('should add relative position', () => {
      const className = generator.addPosition('relative');

      expect(className).toBe('pos-relative');
      const css = generator.getCss();
      expect(css.position.get(className)).toBe('relative');
    });

    it('should add absolute position', () => {
      const className = generator.addPosition('absolute');

      expect(className).toBe('pos-absolute');
      const css = generator.getCss();
      expect(css.position.get(className)).toBe('absolute');
    });
  });

  describe('addColorFromFill', () => {
    it('should add color from solid fill', () => {
      const fills: Paint[] = [
        {
          type: "SOLID" as const,
          color: { r: 1, g: 0, b: 0, a: 1 },
          blendMode: 'NORMAL',
        },
      ];
      const className = generator.addColorFromFill(fills);

      expect(className).toContain('bg-color-');
      const css = generator.getCss();
      expect(css.background.size).toBeGreaterThan(0);
    });
  });

  describe('addGradient', () => {
    it('should add gradient', () => {
      const paint = {
        gradientStops: [
          { color: { r: 1, g: 0, b: 0 }, position: 0 },
          { color: { r: 0, g: 0, b: 1 }, position: 1 },
        ],
      };
      const className = generator.addGradient(paint);

      expect(className).toContain('gradient-');
      const css = generator.getCss();
      expect(css.background.size).toBeGreaterThan(0);
    });
  });

  describe('addMinMaxWidthHeight', () => {
    it('should add min and max width and height', () => {
      const className = generator.addMinMaxWidthHeight(100, 200, 50, 150);

      expect(className).toContain('min-w-100px');
      expect(className).toContain('max-w-200px');
      const css = generator.getCss();
      expect(css['min-width'].get('min-w-100px')).toBe('100px');
      expect(css['max-width'].get('max-w-200px')).toBe('200px');
    });
  });

  describe('addClipsContent', () => {
    it('should add overflow hidden', () => {
      const className = generator.addClipsContent(true);

      expect(className).toBe('overflow-hidden');
      const css = generator.getCss();
      expect(css.overflow.get(className)).toBe('hidden');
    });
  });

  describe('addWrap', () => {
    it('should add wrap style', () => {
      const className = generator.addWrap('WRAP');

      expect(className).toBe('flex-wrap-wrap');
      const css = generator.getCss();
      expect(css['flex-wrap'].get(className)).toBe('wrap');
    });
  });

  describe('addSizingHorizontal', () => {
    it('should add width fill', () => {
      const className = generator.addSizingHorizontal('FILL');

      expect(className).toBe('width-full');
      const css = generator.getCss();
      expect(css.width.get(className)).toBe('100%');
    });
  });

  describe('addSizingVertical', () => {
    it('should add height fill', () => {
      const className = generator.addSizingVertical('FILL');

      expect(className).toBe('height-full');
      const css = generator.getCss();
      expect(css.height.get(className)).toBe('100%');
    });
  });

  describe('addItemSpacing', () => {
    it('should add gap spacing', () => {
      const className = generator.addItemSpacing(16);

      expect(className).toBe('spacing-16px');
      const css = generator.getCss();
      expect(css.gap.get(className)).toBe('16px');
    });
  });

  describe('addAlignment', () => {
    it('should add justify and align items', () => {
      const className = generator.addAlignment('CENTER', 'CENTER');

      expect(className).toContain('justify-center');
      expect(className).toContain('align-center');
      const css = generator.getCss();
      expect(css.flex.size).toBeGreaterThan(0);
    });
  });

  describe('addAbsolutePosition', () => {
    it('should add absolute position with coordinates', () => {
      const className = generator.addAbsolutePosition(10, 20);

      expect(className).toBe('pos-absolute left-10px top-20px');
      const css = generator.getCss();
      expect(css.position.get('pos-absolute')).toBe('absolute');
      expect(css.left.get('left-10px')).toBe('10px');
      expect(css.top.get('top-20px')).toBe('20px');
    });
  });

  describe('addDocumentContainer', () => {
    it('should add document container styles', () => {
      const className = generator.addDocumentContainer();

      expect(className).toBe('figma-document');
      const css = generator.getCss();
      expect(css.width.get(className)).toBe('100vw');
      expect(css.height.get(className)).toBe('100vh');
    });
  });
});
