export default function StorageNotice({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <aside className="storage-notice" role="status">
      <strong>Sobre tu progreso</strong>
      <p>{message}</p>
    </aside>
  );
}
