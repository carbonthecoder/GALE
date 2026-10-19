#!/usr/bin/env bash
set -euo pipefail

# GALE Installer - Minimalist weather TUI
# Repository: https://github.com/carbonthecoder/GALE

BOLD="\033[1m"
GREEN="\033[32m"
YELLOW="\033[33m"
CYAN="\033[36m"
RESET="\033[0m"

echo -e "${BOLD}${CYAN}"
echo "    ~ GALE ~"
echo "   ◇ weather ◇"
echo -e "${RESET}"
echo "Installing GALE terminal weather..."

# Check prerequisites
if ! command -v node >/dev/null 2>&1; then
  echo -e "${YELLOW}Error: Node.js is required but not installed.${RESET}" >&2
  echo "Please install Node.js 18+ and try again." >&2
  exit 1
fi

if ! command -v git >/dev/null 2>&1; then
  echo -e "${YELLOW}Error: git is required but not installed.${RESET}" >&2
  exit 1
fi

INSTALL_DIR="${HOME}/.local/share/gale"
BIN_DIR="${HOME}/.local/bin"
BIN_TARGET="${BIN_DIR}/gale"

mkdir -p "${BIN_DIR}"

if [ -d "${INSTALL_DIR}" ]; then
  echo "Updating existing installation in ${INSTALL_DIR}..."
  cd "${INSTALL_DIR}"
  git fetch origin main
  git reset --hard origin/main
else
  echo "Cloning GALE into ${INSTALL_DIR}..."
  git clone --depth 1 https://github.com/carbonthecoder/GALE.git "${INSTALL_DIR}"
  cd "${INSTALL_DIR}"
fi

echo "Building bundle..."
npm install --silent
npm run build --silent

# Create wrapper executable in ~/.local/bin/gale
cat <<EOF > "${BIN_TARGET}"
#!/usr/bin/env bash
exec node "${INSTALL_DIR}/dist/cli.mjs" "\$@"
EOF

chmod +x "${BIN_TARGET}"

echo -e "${GREEN}✓ GALE installed successfully to ${BIN_TARGET}${RESET}"

# Verify PATH
if [[ ":$PATH:" != *":${BIN_DIR}:"* ]]; then
  echo -e "\n${YELLOW}Note: ${BIN_DIR} is not in your current PATH.${RESET}"
  echo "Add the following line to your ~/.bashrc or ~/.zshrc:"
  echo -e "  ${BOLD}export PATH=\"\$HOME/.local/bin:\$PATH\"${RESET}"
fi

echo -e "\nRun '${BOLD}gale${RESET}' to start, or '${BOLD}gale --web${RESET}' for the local web dashboard.\n"
