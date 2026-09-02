// Isolated on purpose: placeholder formula, swap out when the real one arrives.
const MOUNT_OFFSET = {
  inside: 0,
  outside: 4, // inches added to billable size for outside-mount fabrication allowance
};

function billableArea(width, height, mountType) {
  const offset = MOUNT_OFFSET[mountType] ?? 0;
  const billableWidth = width + offset;
  const billableHeight = height + offset;
  return (billableWidth * billableHeight) / 144; // sq ft, assuming inches in
}

function priceWindow(window, fabric) {
  if (!window.width || !window.height || !window.mount_type || !fabric) return 0;
  const area = billableArea(window.width, window.height, window.mount_type);
  return Math.round(area * fabric.rate * 100) / 100;
}

module.exports = { billableArea, priceWindow };
