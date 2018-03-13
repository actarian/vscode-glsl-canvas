# Glsl Snippets

This snippets collection is built with intention to help understand 2D and 3D WebGL shader programming.
Start typing `glsl.` and select your snippet.

## Animation

| Snippet                      | Purpose                               |
|------------------------------|---------------------------------------|
| `glsl.animation`             | Staggered animations                  |

Global struct for staggered animation. Start typing `glsl.animation`.
You can define the loop `totalTime` with optional offset 
and use `between` method with duration and optional negative or positive offset.

```glsl
    ...
    // total loop duration and offset in seconds
    totalTime(10.0, 0.0);
    // condition between 0.0-2.0 seconds
    if (between(2.0)) {
        // here you can use animation.pow as 0.0-1.0 linear stepper range
        p.x += animation.pow
    }
    ...
```

[Playground](https://actarian.github.io/vscode-glsl-canvas/?glsl=animation)

-----------

## Blend

Blend functions by [Inigo Quilez](http://www.iquilezles.org/).

| Snippet                      | Purpose                         |
|------------------------------|---------------------------------|
| `glsl.modifiers.blend`       | Blend functions                 |

```glsl
    ...
    float d = sBlendExpo(sCircle(p - 0.1, 0.3), sCircle(p + 0.1, 0.3), 0.5);
    float d = sBlendPoly(sCircle(p - 0.1, 0.3), sCircle(p + 0.1, 0.3), 0.5);
    float d = sBlendPower(sCircle(p - 0.1, 0.3), sCircle(p + 0.1, 0.3), 0.5);
    ...
```

[Playground](https://actarian.github.io/vscode-glsl-canvas/?glsl=blend)

-----------

## Boolean

Boolean functions for `union`, `intersect` and `difference` shapes.

| Snippet                      | Purpose                         |
|------------------------------|---------------------------------|
| `glsl.modifiers.boolean`     | Boolean functions               |

```glsl
    ...
    float d = sUnion(sCircle(p - 0.1, 0.3), sCircle(p + 0.1, 0.3));
    float d = sIntersect(sCircle(p - 0.1, 0.3), sCircle(p + 0.1, 0.3));
    float d = sDifference(sCircle(p - 0.1, 0.3), sCircle(p + 0.1, 0.3));
    ...
```

[Playground](https://actarian.github.io/vscode-glsl-canvas/?glsl=boolean)

-----------

## Colors

| Snippet                      | Purpose                         |
|------------------------------|---------------------------------|
| `glsl.colors`                | Colors palette                  |

List of vec3 colors palette. `BLACK`, `WHITE`, `RED`, `GREEN`, `BLUE`, `YELLOW`, `CYAN`, `MAGENTA`, `ORANGE`, `PURPLE`, `LIME`, `ACQUA`, `VIOLET`, `AZUR`. 

```glsl
    ...
    vec3 color = mix(CYAN, MAGENTA, animation.pow);
    ...
```

[Playground](https://actarian.github.io/vscode-glsl-canvas/?glsl=colors)

## Coords

The function define `st` and `mx` vec2 with aspect ratio correction. 
Add coords function at the start of file for use globally. 

| Snippet                      | Purpose                         |
|------------------------------|---------------------------------|
| `glsl.coords`                | Coordinate and unit utils       |

-----------

```glsl
    ...
    color = mix(color, BLACK, circle(mx - st, 0.1));
    ...
```

[Playground](https://actarian.github.io/vscode-glsl-canvas/?glsl=coords)

-----------

## Drawing

Signed distance drawing methods `fill`, `stroke` and `field`. 

| Snippet                      | Purpose                         |
|------------------------------|---------------------------------|
| `glsl.drawing`               | Signed distance drawing methods |

-----------

```glsl
    ...
    color = mix(color, RED, fill(d));
    color = mix(color, BLACK, stroke(d, 0.004));
    color = field(d);
    ...
```

[Playground](https://actarian.github.io/vscode-glsl-canvas/?glsl=drawing)

-----------

## Easing

Easing `in`, `out` and `inOut` equations to convert linear input 0.0-1.0 range 
to correspondent eased values between 0.0 and 1.0. You can use them together with stepper animation.
Adapted from [Robert Penner](http://robertpenner.com/easing/)
 easing equations.

| Snippet                      | Purpose                         |
|------------------------------|---------------------------------|
| `glsl.ease.back.in`          | Ease equation back in           |
| `glsl.ease.bounce.in`        | Ease equation bounce in         |
| `glsl.ease.circular.in`      | Ease equation circular in       |
| `glsl.ease.cubic.in`         | Ease equation cubic in          |
| `glsl.ease.elastic.in`       | Ease equation elastic in        |
| `glsl.ease.expo.in`          | Ease equation expo in           |
| `glsl.ease.quad.in`          | Ease equation quad in           |
| `glsl.ease.quart.in`         | Ease equation quart in          |
| `glsl.ease.quint.in`         | Ease equation quint in          |
| `glsl.ease.sine.in`          | Ease equation sine in           |

Easing function snippet usage example. Start typing `glsl.ease.bounce.out`

```glsl
    ...
    // convert linear input values between 0.0 and 1.0
    // to eased bounce out values between 0.0 and 1.0
    float v = easeBounceOut(animation.pow);
    ...
```

[Playground](https://actarian.github.io/vscode-glsl-canvas/?glsl=easing)

-----------

## Main

Main function, uniforms & utils.

| Snippet                      | Purpose                         |
|------------------------------|---------------------------------|
| `glsl.main.new`              | Main function, uniforms & utils |

-----------

## Object

| Snippet                      | Purpose                               |
|------------------------------|---------------------------------------|
| `glsl.core.object`           | Object struct with distance and color |

Simple global struct for keep distance and color values. 

```glsl
    ...
    object.color = RED;
    object.distance = circle(p, 0.3);
    ...
```

-----------

## Shapes 2D

Various 2D shapes functions with `fill` and `stroke` version.

| Snippet                      | Purpose                         |
|------------------------------|---------------------------------|
| `glsl.shapes.2d.arc`         | Shape 2D arc                    |
| `glsl.shapes.2d.circle`      | Shape 2D circle                 |
| `glsl.shapes.2d.grid`        | Shape 2D grid                   |
| `glsl.shapes.2d.hex`         | Shape 2D hexagon                |
| `glsl.shapes.2d.line`        | Shape 2D line                   |
| `glsl.shapes.2d.pie`         | Shape 2D pie                    |
| `glsl.shapes.2d.plot`        | Shape 2D plot                   |
| `glsl.shapes.2d.poly`        | Shape 2D poly                   |
| `glsl.shapes.2d.rect`        | Shape 2D rect                   |
| `glsl.shapes.2d.roundrect`   | Shape 2D roundrect              |
| `glsl.shapes.2d.segment`     | Shape 2D segment                |
| `glsl.shapes.2d.spiral`      | Shape 2D spiral                 |
| `glsl.shapes.2d.star`        | Shape 2D star                   |

```glsl
    ...
    // arc stroke (pos, size, angle, radians, thickness)
    float d = arc(p, 0.3, 0.0, PI_TWO, 0.004);
    // circle fill (pos, size)
    float d = circle(p, 0.3);
    // circle stroke (pos, size, thickness)
    float d = circle(p, 0.3, 0.004);
    // hex fill (pos, size)
    float d = hex(p, 0.3);
    // hex fill (pos, size)
    float d = hex(p, 0.3, 0.004);
    // grid (size)
    float d = grid(0.1);
    // line stroke (pos, thickness, angle)
    float d = line(p, 0.004, PI);
    // pie fill (pos, size, angle, radians)
    float d = pie(p, 0.3, 0.0, PI_TWO);
    // pie stroke (pos, size, angle, radians, thickness)
    float d = pie(p, 0.3, 0.004, 0.0, PI_TWO);
    // plot stroke (pos, y, thickness)
    float d = plot(p, -p.x, 0.004);
    // poly fill (pos, size, sides)
    float d = poly(p, 0.3, 3);
    // poly stroke (pos, size, sides, thickness)
    float d = poly(p, 0.3, 3, 0.004);
    // rect fill (pos, size)
    float d = rect(p, 0.3);
    // rect stroke (pos, size, thickness)
    float d = rect(p, 0.3, 0.004);
    // roundrect fill (pos, size, corner)
    float d = roundrect(p, 0.3, 0.05);
    // roundrect stroke (pos, size, corner, thickness)
    float d = roundrect(p, 0.3, 0.05, 0.004);
    // segment (a, b, thickness)
    float d = segment(p, p + vec2(0.15), 0.004);
    // spiral (pos, turns)
    float d = spiral(p, 1.0);
    // star fill (pos, size, points)
    float d = roundrect(p, 0.3, 6);
    // star stroke (pos, size, points, thickness)
    float d = roundrect(p, 0.3, 6, 0.004);
    ...
```

[Playground](https://actarian.github.io/vscode-glsl-canvas/?glsl=shapes)

-----------

#### Signed Distance Functions

```glsl
    ...
    d = sArc(p, 0.3, 0.0, PI_TWO);
    d = sCircle(p, 0.3);
    d = sHex(p, 0.3);    
    d = sLine(p, PI_TWO / 2.0);
    d = sSegment(p - vec2(0.15), p + vec2(0.15));    
    d = sPie(p, 0.3, 0.0, PI_TWO);
    d = sPlot(p, -p.x);
    d = sPoly(p, 0.3, 3);
    d = sRect(p, vec2(0.3));
    d = sRoundrect(p, vec2(0.3), 0.05);
    d = sSpiral(p, 1.0);
    d = sStar(p, 0.5, 6);
    ...
```

[Playground](https://actarian.github.io/vscode-glsl-canvas/?glsl=fields)

-----------

## Tile

Tiling function for pattern replication.

| Snippet                      | Purpose                         |
|------------------------------|---------------------------------|
| `glsl.modifiers.tile`        | Tiling function                 |

```glsl
    ...
    vec2 p = tile(st, vec2(0.2, 0.2));
    ...
```

[Playground](https://actarian.github.io/vscode-glsl-canvas/?glsl=tile)

-----------

## Units

Pixel units utility functions. Use `pos(0.0, 0.0)` for positioning and `size(1.0)` for sizes.  

| Snippet                      | Purpose                         |
|------------------------------|---------------------------------|
| `glsl.units`                 | Pixel unit conversion function  |

-----------

```glsl
    ...
    float d = rect(pos(0.0, 0.0), pix(150.0, 150.0), pix(1.0));
    ...
```

[Playground](https://actarian.github.io/vscode-glsl-canvas/?glsl=units)

-----------
