import nlp from 'compromise';

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

// nlp.extend(nlpExport);

export default (text: string) => {
  const result = nlp(text).json();
  return result;
};
