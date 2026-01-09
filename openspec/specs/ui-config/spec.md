# UI Configuration

## Purpose
Provide a configuration mechanism for external links displayed as header buttons so users can customize quick-links via `$XDG_CONFIG_HOME/dv/config.toml` (fallback to `~/.config/dv/config.toml`) and preserve backward compatibility with `DV_VIBE_KANBAN_URL`.

## Requirements

### Requirement: Configurable Header Links
The application MUST allow users to configure a list of external links to be displayed as buttons in the UI header. The canonical configuration SHOULD be stored in `$XDG_CONFIG_HOME/dv/config.toml` under `[[open_links]]` entries. If the environment variable `DV_VIBE_KANBAN_URL` is set, the system MUST include a link named `VIBE-KANBAN` with that URL in the returned list.

#### Scenario: Reading from config file
- **GIVEN** a configuration file exists at `$XDG_CONFIG_HOME/dv/config.toml` (or `~/.config/dv/config.toml`)
- **AND** the file contains multiple `[[open_links]]` entries
- **WHEN** the frontend requests the link configuration via `GET /api/open-link-button`
- **THEN** the API returns a JSON list containing these links with `name` and `url` fields.

#### Scenario: Backward compatibility
- **GIVEN** the environment variable `DV_VIBE_KANBAN_URL` is set to `http://localhost:4000`
- **AND** no config file exists
- **WHEN** the frontend requests the link configuration
- **THEN** the API returns a JSON list containing one link object: `{ "name": "VIBE-KANBAN", "url": "http://localhost:4000" }`.

#### Scenario: Merging config and environment variable
- **GIVEN** the environment variable `DV_VIBE_KANBAN_URL` is set
- **AND** a valid `config.toml` exists with other links
- **WHEN** the frontend requests the link configuration
- **THEN** the API returns a merged list containing the VIBE-KANBAN link and the links from the config file (with no duplicate VIBE-KANBAN entries).

#### Scenario: Frontend rendering
- **GIVEN** the API returns a list of links
- **WHEN** the UI renders the Header
- **THEN** a button is displayed for each link
- **AND** each button opens the corresponding URL in a new tab
- **AND** each button displays the configured name.

