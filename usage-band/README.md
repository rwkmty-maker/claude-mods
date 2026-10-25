# usage-band

Shows how much of your Claude usage is left, in a single quiet line above the message box:
for example `残りの使用量: 5時間 残り77%（回復まで2時間15分） · 7日間 残り60%（回復まで3日4時間）`.
The figures are the rate-limit windows the last response reported; the line turns yellow when a window is 80% used or more.
It needs no setup. The time until reset is shown as a duration, so it does not depend on the time zone.

## Install

    /plugin install usage-band --marketplace rwkmty-maker/claude-mods
