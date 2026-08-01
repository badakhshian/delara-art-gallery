      {purchaseStatus === "success" && (
        <div
          style={{
            background: palette.wall,
            borderBottom: `1px solid rgba(184,141,87,0.25)`,
            padding: "18px 24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.04em",
              color: palette.bone,
              margin: 0,
            }}
          >
            <span style={{ color: palette.brass }}>✓ Purchase confirmed —</span> thank you.
            A receipt has been sent to your email, and Delara will be in touch about delivery.
          </p>
        </div>
      )}
