export const shortAddr = (addr) => {
  if (!addr) return null;
  return `${addr.toString().slice(0, 4)}...${addr.toString().slice(-4)}`;
}