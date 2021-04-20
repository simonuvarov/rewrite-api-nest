import nlp from 'compromise';
import { CRITERIA_TYPE, Rule } from '../rule-engine.service';

const AWL = [
  'abandon',
  'abstract',
  'academy',
  'access',
  'accommodate',
  'accompany',
  'accumulate',
  'accurate',
  'achieve',
  'acknowledge',
  'acquire',
  'adapt',
  'adequate',
  'adjacent',
  'adjust',
  'administration',
  'adult',
  'advocate',
  'affect',
  'aggregate',
  'aid',
  'albeit',
  'allocate',
  'alter',
  'alternative',
  'ambiguous',
  'amend',
  'analogy',
  'analyse',
  'annual',
  'anticipate',
  'apparent',
  'append',
  'appreciate',
  'approach',
  'appropriate',
  'approximate',
  'arbitrary',
  'area',
  'aspect',
  'assemble',
  'assess',
  'assign',
  'assist',
  'assume',
  'assure',
  'attach',
  'attain',
  'attitude',
  'attribute',
  'author',
  'authority',
  'automate',
  'available',
  'aware',
  'behalf',
  'benefit',
  'bias',
  'bond',
  'brief',
  'bulk',
  'capable',
  'capacity',
  'category',
  'cease',
  'challenge',
  'channel',
  'chapter',
  'chart',
  'chemical',
  'circumstance',
  'cite',
  'civil',
  'clarify',
  'classic',
  'clause',
  'code',
  'coherent',
  'coincide',
  'collapse',
  'colleague',
  'commence',
  'comment',
  'commission',
  'commit',
  'commodity',
  'communicate',
  'community',
  'compatible',
  'compensate',
  'compile',
  'complement',
  'complex',
  'component',
  'compound',
  'comprehensive',
  'comprise',
  'compute',
  'conceive',
  'concentrate',
  'concept',
  'conclude',
  'concurrent',
  'conduct',
  'confer',
  'confine',
  'confirm',
  'conflict',
  'conform',
  'consent',
  'consequent',
  'considerable',
  'consist',
  'constant',
  'constitute',
  'constrain',
  'construct',
  'consult',
  'consume',
  'contact',
  'contemporary',
  'context',
  'contract',
  'contradict',
  'contrary',
  'contrast',
  'contribute',
  'controversy',
  'convene',
  'converse',
  'convert',
  'convince',
  'cooperate',
  'coordinate',
  'core',
  'corporate',
  'correspond',
  'couple',
  'create',
  'credit',
  'criteria',
  'crucial',
  'culture',
  'currency',
  'cycle',
  'data',
  'debate',
  'decade',
  'decline',
  'deduce',
  'define',
  'definite',
  'demonstrate',
  'denote',
  'deny',
  'depress',
  'derive',
  'design',
  'despite',
  'detect',
  'deviate',
  'device',
  'devote',
  'differentiate',
  'dimension',
  'diminish',
  'discrete',
  'discriminate',
  'displace',
  'display',
  'dispose',
  'distinct',
  'distort',
  'distribute',
  'diverse',
  'document',
  'domain',
  'domestic',
  'dominate',
  'draft',
  'drama',
  'duration',
  'dynamic',
  'economy',
  'edit',
  'element',
  'eliminate',
  'emerge',
  'emphasis',
  'empirical',
  'enable',
  'encounter',
  'energy',
  'enforce',
  'enhance',
  'enormous',
  'ensure',
  'entity',
  'environment',
  'equate',
  'equip',
  'equivalent',
  'erode',
  'error',
  'establish',
  'estate',
  'estimate',
  'ethic',
  'ethnic',
  'evaluate',
  'eventual',
  'evident',
  'evolve',
  'exceed',
  'exclude',
  'exhibit',
  'expand',
  'expert',
  'explicit',
  'exploit',
  'export',
  'expose',
  'external',
  'extract',
  'facilitate',
  'factor',
  'feature',
  'federal',
  'fee',
  'file',
  'final',
  'finance',
  'finite',
  'flexible',
  'fluctuate',
  'focus',
  'format',
  'formula',
  'forthcoming',
  'foundation',
  'found',
  'framework',
  'function',
  'fund',
  'fundamental',
  'furthermore',
  'gender',
  'generate',
  'generation',
  'globe',
  'goal',
  'grade',
  'grant',
  'guarantee',
  'guideline',
  'hence',
  'hierarchy',
  'highlight',
  'hypothesis',
  'identical',
  'identify',
  'ideology',
  'ignorance',
  'illustrate',
  'image',
  'immigrate',
  'impact',
  'implement',
  'implicate',
  'implicit',
  'imply',
  'impose',
  'incentive',
  'incidence',
  'incline',
  'income',
  'incorporate',
  'index',
  'indicate',
  'individual',
  'induce',
  'inevitable',
  'infer',
  'infrastructure',
  'inherent',
  'inhibit',
  'initial',
  'initiate',
  'injure',
  'innovate',
  'input',
  'insert',
  'insight',
  'inspect',
  'instance',
  'institute',
  'instruct',
  'integral',
  'integrate',
  'integrity',
  'intelligence',
  'intense',
  'interact',
  'intermediate',
  'internal',
  'interpret',
  'interval',
  'intervene',
  'intrinsic',
  'invest',
  'investigate',
  'invoke',
  'involve',
  'isolate',
  'issue',
  'item',
  'job',
  'journal',
  'justify',
  'label',
  'labour',
  'layer',
  'lecture',
  'legal',
  'legislate',
  'levy',
  'liberal',
  'licence',
  'likewise',
  'link',
  'locate',
  'logic',
  'maintain',
  'major',
  'manipulate',
  'manual',
  'margin',
  'mature',
  'maximise',
  'mechanism',
  'media',
  'mediate',
  'medical',
  'medium',
  'mental',
  'method',
  'migrate',
  'military',
  'minimal',
  'minimise',
  'minimum',
  'ministry',
  'minor',
  'mode',
  'modify',
  'monitor',
  'motive',
  'mutual',
  'negate',
  'network',
  'neutral',
  'nevertheless',
  'nonetheless',
  'norm',
  'normal',
  'notion',
  'notwithstanding',
  'nuclear',
  'objective',
  'obtain',
  'obvious',
  'occupy',
  'occur',
  'odd',
  'offset',
  'ongoing',
  'option',
  'orient',
  'outcome',
  'output',
  'overall',
  'overlap',
  'overseas',
  'panel',
  'paradigm',
  'paragraph',
  'parallel',
  'parameter',
  'participate',
  'partner',
  'passive',
  'perceive',
  'percent',
  'period',
  'persist',
  'perspective',
  'phase',
  'phenomenon',
  'philosophy',
  'physical',
  'plus',
  'policy',
  'portion',
  'pose',
  'positive',
  'potential',
  'practitioner',
  'precede',
  'precise',
  'predict',
  'predominant',
  'preliminary',
  'presume',
  'previous',
  'primary',
  'prime',
  'principal',
  'principle',
  'prior',
  'priority',
  'proceed',
  'process',
  'professional',
  'prohibit',
  'project',
  'promote',
  'proportion',
  'prospect',
  'protocol',
  'psychology',
  'publication',
  'publish',
  'purchase',
  'pursue',
  'qualitative',
  'quote',
  'radical',
  'random',
  'range',
  'ratio',
  'rational',
  'react',
  'recover',
  'refine',
  'regime',
  'region',
  'register',
  'regulate',
  'reinforce',
  'reject',
  'relax',
  'release',
  'relevant',
  'reluctance',
  'rely',
  'remove',
  'require',
  'research',
  'reside',
  'resolve',
  'resource',
  'respond',
  'restore',
  'restrain',
  'restrict',
  'retain',
  'reveal',
  'revenue',
  'reverse',
  'revise',
  'revolution',
  'rigid',
  'role',
  'route',
  'scenario',
  'schedule',
  'scheme',
  'scope',
  'section',
  'sector',
  'secure',
  'seek',
  'select',
  'sequence',
  'series',
  'sex',
  'shift',
  'significant',
  'similar',
  'simulate',
  'site',
  'socalled',
  'sole',
  'somewhat',
  'source',
  'specific',
  'specify',
  'sphere',
  'stable',
  'statistic',
  'status',
  'straightforward',
  'strategy',
  'stress',
  'structure',
  'style',
  'submit',
  'subordinate',
  'subsequent',
  'subsidy',
  'substitute',
  'successor',
  'sufficient',
  'sum',
  'summary',
  'supplement',
  'survey',
  'survive',
  'suspend',
  'sustain',
  'symbol',
  'tape',
  'target',
  'task',
  'team',
  'technical',
  'technique',
  'technology',
  'temporary',
  'tense',
  'terminate',
  'text',
  'theme',
  'theory',
  'thereby',
  'thesis',
  'topic',
  'trace',
  'tradition',
  'transfer',
  'transform',
  'transit',
  'transmit',
  'transport',
  'trend',
  'trigger',
  'ultimate',
  'undergo',
  'underlie',
  'undertake',
  'uniform',
  'unify',
  'unique',
  'utilise',
  'valid',
  'vary',
  'vehicle',
  'version',
  'via',
  'violate',
  'virtual',
  'visible',
  'vision',
  'visual',
  'volume',
  'voluntary',
  'welfare',
  'whereas',
  'whereby',
  'widespread',
];

const ACADEMIC_WORDS_MATCH_STRING = `(${AWL.join('|')})`;

export class AcademicWordsRule extends Rule {
  get affects(): CRITERIA_TYPE {
    return CRITERIA_TYPE.LR;
  }
  async _execute(paper: { question: string; body: string }) {
    const doc = nlp(paper.body);

    const matches = doc.match(ACADEMIC_WORDS_MATCH_STRING);
    const matchCount = matches.out('array').length;

    if (matchCount > 2) this.score = 2;
    else {
      this.score = -2;
      this.issues.push({
        affects: this.affects,
        message: 'Use more academic words.',
        shortMessage: 'Academic words',
        isInline: false,
      });
    }
  }
}
