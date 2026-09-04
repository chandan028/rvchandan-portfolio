import { skills } from '@/data/skills';
import { education } from '@/data/education';
import { Reveal } from './reveal';

const core = skills.filter((g) => g.core);
const rest = skills.filter((g) => !g.core);

/**
 * Skills, ranked rather than listed.
 *
 * The depth I would be examined on sits in three emphasised cards across the
 * top; everything else is real but quieter underneath. A flat run of forty
 * technologies is a keyword dump — it tells a reader what I have seen and
 * nothing about where I am actually strong.
 *
 * Still no proficiency bars. They are unfalsifiable and every reader discounts
 * them; position on the page carries the same signal honestly.
 */
export function SkillGrid() {
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-3">
        {core.map((group, i) => (
          <Reveal key={group.label} delay={i * 80}>
            <div className="surface h-full p-5 shadow-e3 transition-[box-shadow,transform] duration-300 ease-settle hover:-translate-y-0.5">
              <p className="font-mono text-micro uppercase text-spider">
                {group.label}
              </p>
              <ul className="mt-3.5 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li key={item} className="chip text-silk">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {rest.map((group, i) => (
          <Reveal key={group.label} delay={i * 70}>
            <div className="surface h-full p-5">
              <p className="section-label">{group.label}</p>
              <ul className="mt-3.5 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}

        {/* Education takes the fourth cell so the last row is not half empty. */}
        <Reveal delay={rest.length * 70}>
          <div className="surface h-full p-5">
            <p className="section-label">Education</p>
            {education.map((entry) => (
              <div key={entry.degree} className="mt-3.5">
                <p className="text-[0.95rem] text-silk">{entry.degree}</p>
                <p className="numeric mt-1 font-mono text-micro text-dust">
                  {entry.institution} · {entry.location} · {entry.period} ·{' '}
                  {entry.detail}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </>
  );
}
