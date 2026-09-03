import { skills } from '@/data/skills';
import { education } from '@/data/education';
import { Reveal } from './reveal';

/**
 * Skills as chips on raised cards rather than slash-separated runs of text.
 *
 * Still no proficiency bars or percentages — they are unfalsifiable and every
 * reader discounts them. What changed is scannability: a recruiter looking for
 * one keyword should find it without reading a sentence.
 */
export function SkillGrid() {
  return (
    /*
     * Education is the last cell of the same grid rather than a card below it.
     * There are seven skill groups, so on a two-column layout the last row
     * would otherwise sit half empty with education stranded underneath.
     */
    <div className="grid gap-4 sm:grid-cols-2">
      {skills.map((group, i) => (
        <Reveal key={group.label} delay={i * 70}>
          <div className="surface h-full p-5 transition-[box-shadow,transform] duration-300 ease-settle hover:-translate-y-0.5 hover:shadow-e3">
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

      <Reveal delay={skills.length * 70}>
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
  );
}
