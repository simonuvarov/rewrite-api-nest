import nlp from 'compromise';
import { CRITERIA_TYPE, Rule } from '../rule-engine.service';

export class PassiveVoiceRule extends Rule {
  private countPassiveVoice(text: string): number {
    nlp.extend((_: nlp.Document, world: nlp.World) => {
      // add methods to run after the tagger does
      world.postProcess((doc) => {
        // The flat tire was changed by Sue
        // The savannah is roamed by beautiful giraffes
        doc
          .match('(is|are|was|were) #Negative? being? #Adverb? [#Verb]', 0)
          .tagSafe('Participle');

        // will be cleaned
        // might be cleaned
        // might have been cleaned
        doc
          .match('#Modal #Negative? (be|get|have been) [#Verb]', 0)
          .tagSafe('Participle');

        // is going to be discussed
        doc
          .match('(is|are|was|were) going to (be|get) #Adverb? [#Verb]', 0)
          .tagSafe('Participle');

        // have been found
        // had been found
        doc.match('(have|has|had) been [#Verb]', 0).tagSafe('Participle');

        // It is known
        // It was determined
        doc.match('It (was|is) [#Verb]', 0).tagSafe('Participle');
      });
    });

    const doc = nlp(text);

    const match = doc.match('#Verb * #Participle');

    return match.out('array').length;
  }

  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.GR;
  }
  async _execute(paper: { question: string; body: string }) {
    const matchCount = this.countPassiveVoice(paper.body);

    if (matchCount >= 1) this.score = 2;
    else {
      this.score = -2;
      this.issues.push({
        affects: this.affects,
        message: 'You need to use passive voice.',
        shortMessage: 'Passive voice',
        isInline: false,
      });
    }
  }
}
