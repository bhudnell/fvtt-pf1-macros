// Adds [precision](https://www.d20pfsrd.com/alternative-rule-systems/mythic/mythic-heroes/mythic-paths-paizo-inc/champion/champion-path-abilities/precision-ex/)
// and mythic power attack to each weapon on the selected actor

const critPartFormula = '(@critCount === 1 ? @powerAttackBonus * 2 : @powerAttackBonus)[Mythic Power Attack]'
const conditionalName = 'MPA Ignore Penalties'

const tokens = canvas.tokens.controlled
if (tokens.length !== 1) {
  ui.notifications.error("Only one token can be selected")
  return
}

for (const w of tokens[0].actor.itemTypes.weapon) {
  const actions = foundry.utils.deepClone(w.system.actions, {strict: true})
  
  for (const action of actions) {
    if (!action.damage.critParts) action.damage.critParts = []
    if (!action.conditionals) action.conditionals = []
    // Precision
    action.formulaicAttacks.bonus.formula = '(@formulaicAttack * -5)+5'
    // Mythic Power Attack
    action.powerAttack = {damageBonus: 3, critMultiplier: 1, multiplier: null}
    if (!action.damage.critParts.find(p => p.formula === critPartFormula)) {   
      action.damage.critParts.push({
        formula: critPartFormula,
        type: { values: ['untyped'], custom: '' }
      })
    }
    if (!action.conditionals.find(c => c.name === conditionalName)) {
      action.conditionals.push({
        _id: foundry.utils.randomID(),
        default: false,
        name: conditionalName,
        modifiers:[{
          _id: foundry.utils.randomID(),
          critical: 'normal',
          formula: '-@powerAttackPenalty',
          target: 'attack',
          subTarget: 'allAttack',
          type: 'untyped' 
        }]
      })
    }
  }
  const updates = {'system.actions': actions}
  
  await w.update(updates)
}
