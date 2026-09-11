#!/usr/bin/env bash
set -Eeuo pipefail

# Run once as root on a fresh Ubuntu 24.04 EC2 instance. The script installs
# Docker from Docker's official apt repository and creates swap for a 1 GB host.
if [[ ${EUID} -ne 0 ]]; then
  echo "Run this script with sudo." >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates curl gnupg

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

. /etc/os-release
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu ${VERSION_CODENAME} stable" \
  > /etc/apt/sources.list.d/docker.list

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker

ADMIN_USER=${SUDO_USER:-ubuntu}
usermod -aG docker "${ADMIN_USER}"

if ! swapon --show=NAME --noheadings | grep -qx '/swapfile'; then
  fallocate -l "${SWAP_SIZE_GB:-2}G" /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
fi

if ! grep -q '^/swapfile ' /etc/fstab; then
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

cat > /etc/sysctl.d/99-threadandbutter.conf <<'EOF'
vm.swappiness=10
vm.vfs_cache_pressure=50
EOF
sysctl --system >/dev/null

install -d -o "${ADMIN_USER}" -g "${ADMIN_USER}" /opt/threadandbutter

echo
echo "EC2 host bootstrap complete. Sign out and back in before running Docker as ${ADMIN_USER}."
