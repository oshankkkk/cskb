---
date: 2026-08-15
Title:
tags: []
---

Parcticles are not shapes. particles are something physcial with a velocity.

# 1. First understand what a simulation is

A normal program might do:

```text
input
  ↓
process
  ↓
output
```

A simulation does this repeatedly:

```text
        ┌──────────────┐
        │  WORLD STATE  │
        └──────┬───────┘
               ↓
            RULES
               ↓
        NEW WORLD STATE
               ↓
             TIME
               │
               └──────────────→ repeat
```

For slime, the world eventually contains thousands of particles.

But you should first make **one thing move**.

---

# 2. Step 1: Make a particle

Since you're using C/raylib, create:

```c
typedef struct {
    Vector2 position;
    Vector2 velocity;
} Agent;
```

Create one:

```c
Agent agent = {
    .position = {400, 300},
    .velocity = {1, 0}
};
```

And every simulation update:

```c
agent.position.x += agent.velocity.x;
agent.position.y += agent.velocity.y;
```

Render it:

```c
DrawCircleV(agent.position, 3, WHITE);
```

Now you have your first simulation.

Seriously.

You have:

```text
STATE
  ↓
position

RULE
  ↓
position += velocity

TIME
  ↓
repeat
```

That's the foundation.

---

# 3. Step 2: Make it bounce

Now your particle interacts with the world.

```c
if (agent.position.x < 0 ||
    agent.position.x > WIDTH)
{
    agent.velocity.x *= -1;
}
```

Same for Y.

Now you're learning:

> **Simulation = state + rules that modify state over time.**

Don't move on until this makes sense.

---

# 4. Step 3: Make 100 particles

Change:

```c
Agent agent;
```

into:

```c
Agent agents[100];
```

Then:

```c
for (int i = 0; i < 100; i++) {
    agents[i].position += agents[i].velocity;
}
```

Now you've discovered something important:

> A simulation is often just **updating a large amount of state repeatedly**.

This is where data structures and performance eventually become important.

---

# 5. Step 4: Give particles randomness

Instead of:

```text
→ → → → → →
```

make them randomly turn.

For example:

```c
agent.velocity = Vector2Rotate(
    agent.velocity,
    random_angle
);
```

Now you have a random-walk-like system.

You'll start seeing:

```text
      ↗
   ↗     ↘
  ●       ↓
   ↖     ↙
      ←
```

This is your first **emergent-looking behavior**, even though the rules are extremely simple.

---

# 6. Step 5: Make agents interact

Now introduce a fundamental simulation concept:

**local interaction.**

For every agent:

```text
look at nearby agents
        ↓
calculate something
        ↓
change behavior
```

For example:

```text
if another agent is too close:
    move away
```

Now your agents aren't independent anymore.

You have:

```text
Agent A ←→ Agent B
    ↕
Agent C
```

This is the beginning of **agent-based simulation**.

---

# 7. Step 6: Make the agents leave a visible trail

Here's where I would introduce the trail map.

Not before.

You've already learned:

* state
* time
* updating
* agents
* movement
* interaction

Now you have a reason to need a trail.

Create:

```c
float trail[WIDTH * HEIGHT];
```

This is simply a **2D array representing the environment**.

Initially:

```text
0 0 0 0 0
0 0 0 0 0
0 0 0 0 0
0 0 0 0 0
```

When an agent walks over a cell:

```c
trail[x + y * WIDTH] += 1.0f;
```

Now your agent leaves a mark.

```text
●───────────────
```

That is a trail map.

You didn't have to learn some special "simulation technology."

It's literally an array.

---

# 8. Step 7: Make the trail disappear

Otherwise your entire screen eventually becomes covered.

Every timestep:

```c
for (int i = 0; i < WIDTH * HEIGHT; i++) {
    trail[i] *= 0.99f;
}
```

Now old trail disappears.

You have:

```text
agent
  ↓
deposit
  ↓
trail
  ↓
decay
  ↓
old trail disappears
```

This is your first environmental state.

---

# 9. Step 8: Make agents read the trail

This is the big conceptual jump.

Previously:

```text
Agent → trail
```

Now:

```text
Agent → trail
        ↑
Agent ← trail
```

The agent can look at three locations:

```text
          LEFT SENSOR
               *
              /
             /
            ●
             \
              \
               *
          RIGHT SENSOR

               *
          CENTER SENSOR
```

Sample:

```c
float left = sampleTrail(leftPosition);
float center = sampleTrail(centerPosition);
float right = sampleTrail(rightPosition);
```

Then:

```text
if left > center && left > right
    turn left

else if right > center && right > left
    turn right

else
    keep going
```

Now you have a feedback loop:

```text
agent moves
   ↓
agent deposits trail
   ↓
trail exists
   ↓
agent senses trail
   ↓
agent changes direction
   ↓
agent deposits more trail
   ↓
...
```

**Now you're doing slime simulation.**

---

# 10. Step 9: Add thousands of agents

Only now:

```c
#define AGENT_COUNT 10000

Agent agents[AGENT_COUNT];
```

Your update becomes roughly:

```c
for each agent:
    sense trail
    change direction
    move
    deposit trail
```

And separately:

```c
diffuse trail
decay trail
```

You now have something resembling the classic particle-based slime simulations.

---

# 11. Step 10: Experiment

This is where **creative programming** starts.

Change one rule.

For example:

```text
sensor distance
sensor angle
turn speed
movement speed
trail deposition
trail decay
diffusion amount
number of agents
```

You might discover:

```text
small sensor distance → chaotic blobs

large sensor distance → long structures

high decay → short-lived trails

low decay → persistent structures

high diffusion → broad structures

low diffusion → thin structures
```

You aren't necessarily trying to make the "correct" slime anymore.

You're exploring the behavior of a system.

---

# The complete progression

This is the path I recommend for you:

```text
1. One moving particle
        ↓
2. Particle + boundaries
        ↓
3. Many particles
        ↓
4. Random movement
        ↓
5. Particles interact
        ↓
6. Particles leave trails
        ↓
7. Trail decay
        ↓
8. Particles sense trails
        ↓
9. Particles follow trails
        ↓
10. Thousands of particles
        ↓
11. Trail diffusion
        ↓
12. Experiment with parameters
        ↓
       SLIME
```

Notice that **trail maps don't appear until step 6**.

That's intentional.

You don't need to know what a trail map is before learning what a simulation is.

---

# And don't worry about the math yet

At this stage, you mainly need:

### Programming

```text
arrays
structs
loops
functions
vectors
```

### Math

```text
x/y coordinates
distance
angles
sin/cos
random numbers
```

### Simulation concepts

```text
state
time
rules
iteration
interaction
feedback
emergence
```

Later you'll encounter:

```text
differential equations
numerical integration
diffusion equations
probability
cellular automata
spatial partitioning
SIMD
GPU computing
```

But **those are things you learn because your simulation eventually needs them**.

You don't need to learn them all before writing your first simulation.

The most important change in mindset is this:

> Don't think "I need to learn simulations before I can make one."

Think:

> **"I'm going to make an extremely stupid simulation, then add one mechanism at a time and learn what each mechanism does."**

That's a much better way to learn this field.
