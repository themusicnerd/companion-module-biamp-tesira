## Biamp Tesira

This module is intended to make Tesira feel like an operator-friendly control surface inside Companion, not just a raw Tesira Text Protocol terminal.

It works well for use cases such as:

- commentary and announcer positions
- cough and talkback panels
- studio or venue comms interfaces
- video conference room control
- hybrid presentation systems
- general audio control and status monitoring

When you first connect, the module can take up to 30 seconds to gather the available `Instance ID's` for control and feedback. In Tesira Text Protocol those same names are returned as `aliases`.

The module can be used in two ways:

- `Manual controls`
  - build buttons offline before the Tesira is connected
- discovered controls
  - connect to Tesira, fetch instance tags, and let the module generate starter presets automatically

Tesira Software calls these `Instance ID's`, however the Tesira Text Protocol calls them `Aliases`. This module will refer to them as `Instance ID's` because most people will be building the file and the name mix-a-roo makes it confusing.

### What the module gives you

- mute, level, cough, talk, and latch-talk button workflows
- discovered router/source-selector mute, level, and route-status presets
- rotary level button presets with mute on press
- VU, gain reduction, and horizontal level meter feedbacks
- a flexible meter builder for more advanced meter layouts
- startup subscriptions, so the module can subscribe to key feedback information upon module startup
- automatic control-to-meter pairing when instance tags follow a consistent naming pattern
- live min/max range probing for discovered controls that expose `minLevel` and `maxLevel`
- manual overrides when the Tesira file cannot be renamed
- raw and custom command paths for advanced Tesira attributes

## Tesira Setup

### 1. Enable Tesira telnet control

Before Companion can talk to Tesira, enable Telnet in Tesira software and send the configuration to the device.

1. Open the Tesira system in Tesira software.
2. Open the device network settings.
3. Go to the `Control Network` tab.
4. In `Services`, enable `Telnet`.
5. Apply the change and send the file to the device.
6. Confirm the control network can reach the Tesira on port `23`.

If the connection is refused, the first things to check are:

- Telnet is actually enabled on the Tesira
- the correct IP address is being used
- TCP port `23` is reachable from the Companion host

### 2. Best-practice block design

For most operator control pages, `Level` blocks are the best control blocks to expose.

Recommended Level block settings:

- use a `Level` block for level and mute control
- enable `Use Logic`
- enable `Ramp Controls`
- expose the block with a clean instance tag

Why this matters:

- this allows you to build easier for end-users buttons and knobs, it is the same way you would program with oldscool AMX, Crestron, Control4 etc.
- mute and level feedback map cleanly to operator buttons
- rotary level buttons behave better when the underlying control is a proper Level block

For metering, expose a dedicated meter block where possible:

- `Audio Meter (Peak & RMS)` for VU-style metering
- compressor, limiter, leveler, AGC, or gate blocks for gain reduction style feedback

### 3. Best-practice naming

The automatic pairing logic is based on similar instance-tag names.

Recommended examples:

- `LEVEL-LECTERN` and `METER-LECTERN`
- `LEVEL-PC` and `METER-PC`
- `LEVEL-COMMS-A` and `METER-COMMS-A`
- `LEVEL-GUEST-1` and `METER-GUEST-1`

This makes it much easier for the module to understand:

- which level control belongs to which meter
- which presets should get a horizontal level bar plus a paired VU meter

If your design also exposes gain reduction, keep that equally obvious:

- `COMP-LECTERN`
- `LIMIT-PC`
- `AGC-CALLER-A`

## Companion Setup

### 1. Basic connection

In the Companion module config:

- `Tesira host`
  - enter the Tesira IP address or hostname
- `Port`
  - normally leave this at `23`
- `Fetch instance tags after connect`
  - runs `SESSION get aliases` automatically after the Tesira welcome banner is received
  - on larger systems this can take about 30 seconds

### 2. The most important Companion settings

These three settings are the key to making the module feel polished in daily use:

- `Always subscribe these level control instance tags`
- `Always subscribe these VU meter instance tags`
- `Control to meter pairing overrides`
- `Level range overrides`
- `Source selector names`

The module will now also probe discovered Instance ID's for live `minLevel` and `maxLevel` values when Tesira exposes them. It will retry those one-shot probes again when a control or meter Instance ID is actually subscribed, so level meters, VU meters, knob feedbacks, and other meter-style feedbacks can follow the real Tesira range instead of assuming a generic span.

#### Always subscribe these level control instance tags

This is the easiest way to make important controls feel live as soon as the module connects.

Use it for:

- cough buttons
- talk buttons
- latching talk buttons
- mute buttons
- rotary level buttons
- key comms and commentator channels

Format:

- comma-separated level block instance tags

Example:

- `LEVEL-LECTERN,LEVEL-COMMS-A,LEVEL-CALLER-1`

What the module does:

- subscribes to `level 1` at `250 ms`
- subscribes to `mute 1` at `250 ms`

This means the level and mute feedback is already running before the operator presses a button.

#### Always subscribe these VU meter instance tags

Use this for meter blocks you always want live on the page.

Format:

- comma-separated meter instance tags

Example:

- `METER-LECTERN,METER-COMMS-A,METER-CALLER-1`

What the module does:

- subscribes to `level 1` at `150 ms`

This is especially useful for:

- rotary level presets with paired VU
- commentator panels
- comms panels
- conference pages where the meters should already be alive before any button is touched

#### Control to meter pairing overrides

Use this when the automatic naming matcher cannot work out the correct pairing, or when the Tesira file cannot be renamed.

Format:

- `controlTag=meterTag,controlTag2=meterTag2`

Example:

- `LEVEL-LECTERN=METER-ANNOUNCER,LEVEL-PC=METER-HDMI-A`

Use this when:

- the control and meter names do not share the same base name
- one control should intentionally point to a different meter block

#### Level range overrides

Tesira alias discovery does not expose the real minimum and maximum range of a Level block by itself.

However, when a discovered Level block supports:

- `get minLevel 1`
- `get maxLevel 1`

the module now probes those values automatically after discovery and uses them for the horizontal level feedback range.

If the block does not expose those attributes, or if you want to force a specific range, add an override.

The module now does the same style of live probing anywhere Tesira exposes:

- `get minLevel 1`
- `get maxLevel 1`

That includes the discovered level and meter workflows, and any manual meter feedback where you enter the relevant `Instance ID for live range`.

Format:

- `tag=min:max,tag2=min:max`

Example:

- `LEVEL-LECTERN=-40:0,LEVEL-COMMS-A=-60:10`

#### Source selector names

Use this when a `Source Selector` alias should generate named source-select buttons.

Format:

- `selectorTag=name|name|name,selectorTag2=name|name`

Example:

- `SRCSEL-ROOM=PC|Lectern|Wireless`

What it does:

- treats selectors as single-output source selectors
- generates one discovered source button per listed source name
- highlights the active source based on live `sourceSelection 1`

Routers are handled differently:

- aliases that look like routers will fan out by discovered output count
- the module discovers outputs by polling `sourceSelection`, `outputLevel`, and `outputMute`
- each discovered output gets its own router status, mute, and trim presets

## Presets And Control Families

The module now organizes presets in this order:

- `01 Manual controls`
- `02 Discover Instance ID's`
- `03 Subscribe To Instance Feedback`
- `04 Mute Controls (Discovered)`
- `05 Level Controls (Discovered)`
- `06 Routers (Discovered)`
- `07 VU Meters (Discovered)`
- `08 Knob Presets (Discovered)`
- `09 Cough Mute (momentary mute) (Discovered)`
- `10 Talk (momentary unmute) (Discovered)`
- `11 Latching Talk (Discovered)`

### 01 Manual controls

Use these when:

- you want to build a page before the Tesira is online
- you already know your instance tags
- you want to duplicate and hand-edit a control layout quickly

The manual controls use placeholder tags such as:

- `InstanceTag`
- `MeterTag`
- `GainReductionTag`

You can drag them in, duplicate them, and then edit the action options on each button.

### 02 Discover Instance ID's

This is the one-click action that runs instance-tag discovery.

Use it after the module connects.

Important:

- discovery can take about 30 seconds on larger Tesira systems

### 03 Subscribe To Instance Feedback

These are discovered starter buttons intended to get live feedback flowing for a discovered instance tag.

Use them when:

- you want a quick way to subscribe and inspect a discovered object
- you are testing a newly exposed Tesira control

### 04 Mute Controls (Discovered)

These are latching mute buttons for discovered level-style controls.

Button face:

- the mute buttons keep `MUTE` plus the `Instance ID`
- this makes it easier for operators to see exactly which source they are muting

They are intended for:

- mute panels
- commentator mic mute
- conference room mic or program mute

### 05 Level Controls (Discovered)

These are discovered level buttons such as:

- level up
- level down
- horizontal level meter buttons

Button face:

- the `+` and `-` buttons are intentionally minimal
- they do not show the live level value
- they do not show the `Instance ID`
- this keeps them clean and fast to read on compact control pages

They are intended for:

- program level trims
- IFB level
- commentator headphone levels
- conference room send and receive level control

### 06 Routers (Discovered)

These are discovered router and source-selector buttons for aliases that look like router blocks.

They subscribe to and show:

- `sourceSelection 1`
- `outputLevel 1`
- `outputMute 1`

They are intended for:

- source selectors
- source routers
- room-source selection pages
- program-routing pages where output mute and trim are also useful

### 07 VU Meters (Discovered)

These are discovered meter buttons for:

- audio meters
- gain reduction sources such as compressors, limiters, AGC, and gates

### 08 Knob Presets (Discovered)

These are the main “operator” presets for systems that want a compact combined control.

Behavior:

- rotate left: level down
- rotate right: level up
- push: mute toggle
- feedback: level plus VU

This is ideal for:

- commentator positions
- comms stations
- conference mic channels
- small control pages where one control should do a lot

### 09 Cough Mute (momentary mute) (Discovered)

Behavior:

- press: mute
- release: unmute

Use for:

- commentator cough
- live mic momentary mute

### 10 Talk (momentary unmute) (Discovered)

Behavior:

- press: unmute
- release: mute

Use for:

- talkback
- producer comms
- booth-to-stage momentary talk

### 11 Latching Talk (Discovered)

Behavior:

- press: toggle mute state

Use for:

- latching talkback
- intercom panels
- small systems where a simple on/off talk path is preferred

## Meter Feedbacks

The module includes named meter feedbacks and a more powerful configurable one.

### Ready-made meter feedbacks

- `Meter - VU Meter - Full Button`
- `Meter - VU Meter - Left Of Button`
- `Meter - VU Meter - Right Of Button`
- `Meter - VU Meter - Left Of Button + Inner Gain Reduction`
- `Meter - VU Meter - Right Of Button + Inner Gain Reduction`
- `Meter - Horizontal Level Meter`
- `Meter - Horizontal Level Meter - Left VU Meter`
- `Meter - Horizontal Level Meter - Right VU Meter`
- `Meter - Horizontal Level Meter - Left VU Meter + Inner Gain Reduction`
- `Meter - Horizontal Level Meter - Right VU Meter + Inner Gain Reduction`
- `Meter - Gain Reduction`

The horizontal level variants allow the user to choose the horizontal meter colour.

For manual or custom meter feedbacks, the meter feedbacks now include an `Instance ID for live range` field, or separate level and VU Instance ID fields on combined layouts.

Use those fields when:

- you are building manually instead of using discovered presets
- the feedback source variable does not follow the module's discovered naming
- you still want the feedback to use the real Tesira min/max range

### Flexible Meter

`Meter - Flexible Meter` is the catch-all meter builder.

Use it when you want one feedback definition that can handle:

- full-button VU
- left or right side VU
- inner gain reduction strips
- horizontal level with side VU
- stereo VU
- stereo dual gain reduction

This is the right choice when the fixed feedback list starts feeling too specific.

## Custom Commands And Extra Attributes

Not everything in Tesira is a level block or meter block. For things like:

- AEC enable state
- noise reduction amount
- NLP amount
- custom logic or status attributes

use the custom action path:

- `Custom Tesira command builder`
- `Custom raw Tesira command`
- `Custom attribute subscription`
- `Add custom recurring GET polling`

Recommended pattern:

1. Subscribe if the Tesira attribute supports subscriptions.
2. Poll if it does not.
3. Store the result in a clear variable name.
4. Apply one of the generic state feedbacks.

Useful generic feedbacks:

- `Feature state`
  - for values like `true`, `false`, `on`, `off`, `enabled`, `1`
- `Numeric value in range`
  - for values such as NR amount or NLP amount
- `Numeric value matches condition`
  - for exact thresholds or above/below logic

## Subscription Rates

The module uses a split rate profile intended to be responsive without being excessive.

Built-in defaults:

- level and mute feedback: `250 ms`
- VU and gain reduction meter feedback: `150 ms`
- generic custom subscription default: `1000 ms` unless you change it

This is a good practical balance for most Tesira systems:

- fast enough for operators
- not unnecessarily aggressive on the Tesira or Companion

## Notes And Limits

- Tesira subscriptions are session-based. If the connection drops, Tesira loses the subscriptions. The module re-sends tracked subscriptions after reconnect.
- alias discovery only returns instance tags, but the module now follows discovery with live `minLevel` and `maxLevel` probes for all discovered Instance ID's and retries those probes again when controls and meters are subscribed
- automatic live range matching works best for discovered presets and for manual/custom meter feedbacks where you fill in the `Instance ID for live range` field
- if a Tesira object does not expose `minLevel` and `maxLevel`, `Level range overrides` or the explicit feedback min/max fields are still the correct fallback
- the module uses a second telnet session for recurring polling so GET traffic does not interfere with subscription traffic

## References

- Tesira Text Protocol:
  - https://support.biamp.com/Tesira/Control/Tesira_Text_Protocol
- Tesira DSP blocks that support subscriptions:
  - https://support.biamp.com/Tesira/Control/Tesira_Text_Protocol/Tesira_DSP_blocks_that_support_subscriptions
