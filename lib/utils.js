export const shortAddr = (addr) => {
  return `${addr.toString().slice(0, 5)}...${addr.toString().slice(-5)}`;
}