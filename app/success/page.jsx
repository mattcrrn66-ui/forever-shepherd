export default async function SuccessPage({ searchParams }) {
  const sp = await searchParams; // Next 16.1: searchParams can be a Promise
  const sessionId = sp?.session_id;

  return (
    <main style={{ padding: 24 }}>
      <h1>Payment successful ✅</h1>
      <p>Thanks! Your order is being prepared.</p>

      {sessionId && (
        <p style={{ opacity: 0.7, wordBreak: "break-all" }}>
          Session: {sessionId}
        </p>
      )}
    </main>
  );
}
