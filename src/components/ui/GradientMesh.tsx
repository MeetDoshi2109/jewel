'use client'

export default function GradientMesh({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {/* Blob 1 - gold */}
      <div
        className="absolute rounded-full blur-3xl animate-blob"
        style={{
          width: '55%',
          height: '55%',
          top: '-10%',
          left: '-5%',
          background: 'radial-gradient(circle, rgba(201,160,91,0.18) 0%, transparent 70%)',
        }}
      />
      {/* Blob 2 - rose gold */}
      <div
        className="absolute rounded-full blur-3xl animate-blob-delay"
        style={{
          width: '45%',
          height: '60%',
          top: '30%',
          right: '-10%',
          background: 'radial-gradient(circle, rgba(183,110,121,0.14) 0%, transparent 70%)',
        }}
      />
      {/* Blob 3 - champagne */}
      <div
        className="absolute rounded-full blur-3xl animate-blob-delay2"
        style={{
          width: '50%',
          height: '40%',
          bottom: '-5%',
          left: '25%',
          background: 'radial-gradient(circle, rgba(221,185,106,0.12) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}
