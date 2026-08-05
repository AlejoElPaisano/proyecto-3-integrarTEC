'use client'

import { useEffect } from "react";
import Link from "next/link";
import BatchGenerator from "@/features/batch/components/BatchGenerator";
import { usePasswordStore } from "@/features/generator/store";
import { useHasMounted } from "@/shared/hooks/useHasMounted";

export default function BatchPage() {
	const setStep = usePasswordStore((state) => state.setStep);
	const generateBatch = usePasswordStore((state) => state.generateBatch);
	const hasMounted = useHasMounted();

	useEffect(() => {
		setStep(3);
	}, [setStep]);

	useEffect(() => {
		if (!hasMounted) return;
		generateBatch();
	}, [generateBatch, hasMounted]);

	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				padding: "2rem 1rem",
			}}
		>
			<div style={{ width: "100%", maxWidth: "680px" }}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						marginBottom: "1.5rem",
					}}
				>
					<div>
						<h1
							style={{
								fontSize: "1.5rem",
								fontWeight: 800,
								letterSpacing: "-0.03em",
								background: "linear-gradient(135deg, #e2e2f0, #a78bfa)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								backgroundClip: "text",
								marginBottom: "0.25rem",
							}}
						>
							Generación por lote
						</h1>
						<p
							style={{
								fontSize: "0.85rem",
								color: "var(--color-text-secondary)",
							}}
						>
							Generá múltiples frases de una sola vez
						</p>
					</div>
					<Link
						href="/generator"
						style={{
							color: "var(--color-accent)",
							fontSize: "0.85rem",
							textDecoration: "none",
							fontWeight: 500,
							padding: "0.4rem 0.85rem",
							borderRadius: "var(--radius-sm)",
							border: "1px solid var(--color-border)",
							transition: "border-color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out)",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.borderColor = "var(--color-accent)";
							e.currentTarget.style.background = "var(--color-accent-soft)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.borderColor = "var(--color-border)";
							e.currentTarget.style.background = "transparent";
						}}
					>
						← Generador simple
					</Link>
				</div>

				<div
					className="glass-card"
					style={{
						background: "var(--color-card)",
						border: "1px solid var(--color-border)",
						borderRadius: "var(--radius-xl)",
						padding: "2.5rem",
						backdropFilter: "blur(24px)",
						WebkitBackdropFilter: "blur(24px)",
						boxShadow: "var(--glass-shadow)",
					}}
				>
					<BatchGenerator />
				</div>

				<div
					style={{
						marginTop: "1.5rem",
						textAlign: "center",
						fontSize: "0.75rem",
						color: "var(--color-text-tertiary)",
						lineHeight: 1.6,
					}}
				>
					<p>
						Las frases generadas se agregan automáticamente al historial de
						sesión
					</p>
					<p>Usá el botón 🤖 (abajo a la derecha) para ver el historial</p>
				</div>
			</div>
		</div>
	);
}
