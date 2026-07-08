// Deprecated: scoring logic is computed in the frontend. This file is kept to avoid orphaned imports during migration.
export default function handler(req, res) {
  res.status(410).json({ message: 'Deprecated' });
}
