# UI Configuration

## ADDED Requirements

### Requirement: Configurable Header Links
The application MUST allow users to configure a list of external links to be displayed as buttons in the UI header.

#### Scenario: Reading from config file
- **Given** a configuration file exists at `$XDG_CONFIG_HOME/dv/config.toml` (or `~/.config/dv/config.toml`)
- **And** the file contains multiple `[[open_links]]` entries
- **When** the frontend requests the link configuration
- **Then** the API returns a JSON list containing these links with their names and URLs.

#### Scenario: Backward compatibility with Environment Variable
- **Given** the environment variable `DV_VIBE_KANBAN_URL` is set to `http://localhost:4000`
- **And** no config file exists
- **When** the frontend requests the link configuration
- **Then** the API returns a JSON list containing one link: `{ "name": "VIBE-KANBAN", "url": "http://localhost:4000" }`.

#### Scenario: Merging Config and Environment Variable
- **Given** the environment variable `DV_VIBE_KANBAN_URL` is set
- **And** a valid `config.toml` exists with other links
- **When** the frontend requests the link configuration
- **Then** the API returns a merged list containing the Vibe Kanban link AND the links from the config file.

#### Scenario: Frontend Rendering
- **Given** the API returns a list of links
- **When** the UI renders the Header
- **Then** a button is displayed for each link
- **And** each button opens the corresponding URL in a new tab
- **And** each button displays the configured name.
