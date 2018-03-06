# Glsl Snippets

This snippets collection is built with intention to help to understand 2D and 3D WebGL shader programming.
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
        st.x += animation.pow
    }
    ...
```

[Playground](http://thebookofshaders.com/edit.php?log=180303091427)

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

## Coords

The function define `st` and `mx` vec2 with aspect ratio correction. 
Add coords function at the start of file for use globally. 

| Snippet                      | Purpose                         |
|------------------------------|---------------------------------|
| `glsl.coords`                | Pixel units utility functions   |

-----------

```glsl
    ...
    color = mix(color, BLACK, circle(mx - st, 0.1));
    ...
```

[Playground](http://thebookofshaders.com/edit.php?log=180302165324)

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

[Playground](http://thebookofshaders.com/edit.php?log=180303091427)

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
    object.distance = circle(vec2(0.0), 0.3);
    ...
```

-----------

## Shapes 2D

Different 2D shapes functions with fill and outline version.

| Snippet                      | Purpose                         |
|------------------------------|---------------------------------|
| `glsl.shapes.2d.arc`         | Shape 2D arc                    |
| `glsl.shapes.2d.circle`      | Shape 2D circle                 |
| `glsl.shapes.2d.grid`        | Shape 2D grid                   |
| `glsl.shapes.2d.line`        | Shape 2D line                   |
| `glsl.shapes.2d.pie`         | Shape 2D pie                    |
| `glsl.shapes.2d.plot`        | Shape 2D plot                   |
| `glsl.shapes.2d.poly`        | Shape 2D poly                   |
| `glsl.shapes.2d.rect`        | Shape 2D rect                   |
| `glsl.shapes.2d.rectline`    | Shape 2D rectline               |
| `glsl.shapes.2d.roundrect`   | Shape 2D roundrect              |
| `glsl.shapes.2d.spiral`      | Shape 2D spiral                 |
| `glsl.shapes.2d.star`        | Shape 2D star                   |

```glsl
    ...
    // arc fill (pos, angle, radians, size)
    float d = arc(vec2(0.0), 0.0, PI_TWO, 0.5);
    // arc outline (pos, angle, radians, size, thickness)
    float d = arc(vec2(0.0), 0.0, PI_TWO, 0.5, 0.04);
    // circle fill (pos, diameter)
    float d = circle(vec2(0.0), 0.5);
    // circle outline (pos, diameter, thickness)
    float d = circle(vec2(0.0), 0.5, 0.04);
    // grid (size)
    float d = grid(0.1);
    // line (a, b, thickness)
    float d = line(vec2(0.0), vec2(0.5), 0.04);
    // pie fill (pos, angle, radians, size)
    float d = pie(vec2(0.0), 0.0, PI_TWO, 0.5);
    // pie outline (pos, angle, radians, size, thickness)
    float d = pie(vec2(0.0), 0.0, PI_TWO, 0.5, 0.04);
    // plot outline (pos, y, thickness)
    float d = plot(vec2(0.0), 0.1, 0.04);
    // poly fill (pos, size, sides)
    float d = poly(vec2(0.0), 0.3, 3);
    // poly outline (pos, size, sides, thickness)
    float d = poly(vec2(0.0), 0.3, 3, 0.04);
    // rect fill (pos, size)
    float d = rect(vec2(0.0), 0.3);
    // rect outline (pos, size, thickness)
    float d = rect(vec2(0.0), 0.3, 0.04);
    // rectline outline (pos, thickness, angle)
    float d = rectline(vec2(0.0), 0.04, PI);
    // roundrect fill (pos, size, radius)
    float d = roundrect(vec2(0.0), 0.3, 0.05);
    // roundrect outline (pos, size, radius, thickness)
    float d = roundrect(vec2(0.0), 0.3, 0.05, 0.04);
    // spiral (pos, turns)
    float d = spiral(vec2(0.0), 1.0);
    // star fill (pos, size, points)
    float d = roundrect(vec2(0.0), 0.3, 6);
    // star outline (pos, size, points, thickness)
    float d = roundrect(vec2(0.0), 0.3, 6, 0.04);
    ...
```

[Playground](http://thebookofshaders.com/edit.php?log=1520061191715)

-----------

## Tile 2D

Tiling function for pattern replication.

| Snippet                      | Purpose                         |
|------------------------------|---------------------------------|
| `glsl.modifiers.tile`        | Tiling function                 |

```glsl
    ...
    float d = roundrect(vec2(0.0), 0.3, 0.05, 0.01);
    ...
```

[Playground](http://thebookofshaders.com/edit.php?log=1520061191715)

-----------

## Units

Pixel units utility functions. Use `pos(0.0, 0.0)` for positioning and `pix(1.0)` for sizes.  

| Snippet                      | Purpose                         |
|------------------------------|---------------------------------|
| `glsl.units`                 | Pixel units utility functions   |

-----------

```glsl
    ...
    float d = rect(pos(0.0, 0.0), pix(150.0, 150.0), pix(1.0));
    ...
```

[Playground](http://thebookofshaders.com/edit.php?log=180302165324)

-----------
