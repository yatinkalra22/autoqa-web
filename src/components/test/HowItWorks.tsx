import { HOW_IT_WORKS_STEPS } from '@/mocks/howItWorksSteps'

export function HowItWorks() {
  return (
    <div className="mt-16">
      <h2 className="text-center text-sm font-medium text-[var(--theme-muted)] tracking-wider uppercase mb-6">
        How it works
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {HOW_IT_WORKS_STEPS.map((step, i) => (
          <div
            key={step.title}
            className="relative bg-white/80 border border-[#b9cbe8] rounded-xl p-4 text-center shadow-sm"
          >
            {i < HOW_IT_WORKS_STEPS.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-2 w-4 text-[#b9cbe8] -translate-y-1/2 z-10 text-base">
                &rarr;
              </div>
            )}
            <div className={`w-10 h-10 rounded-lg border ${step.color} flex items-center justify-center mx-auto mb-3`}>
              <step.icon className="w-5 h-5" />
            </div>
            <p className="text-[var(--theme-text)] text-sm font-medium mb-1">{step.title}</p>
            <p className="text-[var(--theme-muted)] text-xs leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
