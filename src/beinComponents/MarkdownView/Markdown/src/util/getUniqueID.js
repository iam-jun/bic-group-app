let uuid = new Date().getTime();

export default function getUniqueID() {
  uuid += 1;
  return `rnmr_${uuid.toString(16)}`;
}
