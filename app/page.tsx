export default function Page() {
  return (
    <main>
      <h1 style={{ fontSize: 48, margin: 0 }}>Forever Shepherd</h1>
      <p style={{ marginTop: 12, fontSize: 18, opacity: 0.8 }}>
        Guidance that remains.
      </p>

      <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a
          href="/product"
          style={{
            display: "inline-block",
            padding: "12px 16px",
            border: "1px solid currentColor",
            borderRadius: 10,
            textDecoration: "none",
          }}
        >
          First Release
        </a>
        <a
          href="/legal"
          style={{
            display: "inline-block",
            padding: "12px 16px",
            border: "1px solid currentColor",
            borderRadius: 10,
            textDecoration: "none",
            opacity: 0.85,
          }}
        >
          Shipping & Returns
        </a>
      </div>
    </main>
  );
}
