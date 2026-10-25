# claude-mods

Claude Code mods by Komatsu (MIT license).

## usage-band

Shows the remaining Claude usage (5-hour and 7-day windows) in one quiet line above the prompt.

Install (Claude Code 2.1.275 or later):

    /plugin install usage-band --marketplace rwkmty-maker/claude-mods

To have it in every Claude Code on your PC, add this to `~/.claude/settings.json`:

    {
      "extraKnownMarketplaces": { "komatsu-mods": { "source": { "source": "github", "repo": "rwkmty-maker/claude-mods" } } },
      "enabledPlugins": { "usage-band@komatsu-mods": true }
    }
