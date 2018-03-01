# Glsl Snippets

This snippets collection is built with intention to help to understand 2D and 3D WebGL shader programming.
Start typing `glsl.` and select your snippet.

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

## Core

| Snippet                      | Purpose                         |
|------------------------------|---------------------------------|
| `glsl.core.animation`        | Main function, uniforms & utils |
| `glsl.core.coord`            | Main function, uniforms & utils |
| `glsl.core.object`           | Main function, uniforms & utils |
| `glsl.core.tile`             | Main function, uniforms & utils |

Animation snippet usage example. Start typing `glsl.core.animation`

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

-----------

## Ease

Easing `in`, `out` and `inOut` equations to convert linear input 0.0-1.0 range 
to correspondent eased values between 0.0 and 1.0.
You can use them together with stepper animation.

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

-----------

## Main

Main function, uniforms & utils.

| Snippet                      | Purpose                         |
|------------------------------|---------------------------------|
| `glsl.main.new`              | Main function, uniforms & utils |

-----------

## Shapes 2D

Different 2D shapes functions with fill and outline version.

| Snippet                      | Purpose                         |
|------------------------------|---------------------------------|
| `glsl.shapes.2d.circle`      | Shape 2D circle                 |
| `glsl.shapes.2d.grid`        | Shape 2D grid                   |
| `glsl.shapes.2d.line`        | Shape 2D line                   |
| `glsl.shapes.2d.plot`        | Shape 2D plot                   |
| `glsl.shapes.2d.poly`        | Shape 2D poly                   |
| `glsl.shapes.2d.rect`        | Shape 2D rect                   |
| `glsl.shapes.2d.roundrect`   | Shape 2D roundrect              |

```glsl
    ...
    // circle fill (pos, diameter)
    float d = circle(vec2(0.0), 0.5);
    // circle outline (pos, diameter, thickness)
    float d = circle(vec2(0.0), 0.5, 0.01);
    // grid (size)
    float d = grid(0.1);
    // line (a, b, thickness)
    float d = line(vec2(0.0), vec2(0.5), 0.01);
    // plot outline (pos, thickness, angle)
    float d = plot(vec2(0.0), 0.01, PI);
    // poly fill (pos, size, sides)
    float d = poly(vec2(0.0), 0.3, 3);
    // poly outline (pos, size, sides, thickness)
    float d = poly(vec2(0.0), 0.3, 3, 0.01);
    // rect fill (pos, size)
    float d = rect(vec2(0.0), 0.3);
    // rect outline (pos, size, thickness)
    float d = rect(vec2(0.0), 0.3, 0.01);
    // roundrect fill (pos, size, radius)
    float d = roundrect(vec2(0.0), 0.3, 0.05);
    // roundrect outline (pos, size, radius, thickness)
    float d = roundrect(vec2(0.0), 0.3, 0.05, 0.01);
    ...
```

-----------
