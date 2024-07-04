// opens a dialog to create a gloom blade weapon on the selected actor

const abilityList = {
  def: 'Defending (+1)',
  flm: 'Flaming (+1)',
  frs: 'Frost (+1)',
  ght: 'Ghost Touch (+1)',
  ken: 'Keen (+1)',
  mer: 'Merciful (+1)',
  shk: 'Shock (+1)',
  thu: 'Thundering (+1)',
  vic: 'Vicious (+1)',
  ana: 'Anarchic (+2)',
  axi: 'Axiomatic (+2)',
  flb: 'Flaming Burst (+2)',
  icb: 'Icy Burst (+2)',
  hol: 'Holy (+2)',
  shb: 'Shocking Burst (+2)',
  unh: 'Unholy (+2)',
  wou: 'Wounding (+2)',
  spe: 'Speed (+3)',
  bre: 'Brilliant Energy (+4)',
  dan: 'Dancing (+4)',
  smh: 'Smashing (+1)',
  thr: 'Throwing (+1)'
}

const abilityLabel = {
  def: 'Defending',
  flm: 'Flaming',
  frs: 'Frost',
  ght: 'Ghost Touch',
  ken: 'Keen',
  mer: 'Merciful',
  shk: 'Shock',
  thu: 'Thundering',
  vic: 'Vicious',
  ana: 'Anarchic',
  axi: 'Axiomatic',
  flb: 'Flaming Burst',
  icb: 'Icy Burst',
  hol: 'Holy',
  shb: 'Shocking Burst',
  unh: 'Unholy',
  wou: 'Wounding',
  spe: 'Speed',
  bre: 'Brilliant Energy',
  dan: 'Dancing',
  smh: 'Smashing',
  thr: 'Throwing'
}

const ablToDmgType = {
  flm: 'fire',
  frs: 'cold',
  shk: 'electric',
  flb: 'fire',
  icb: 'cold',
  shb: 'electric',
  mer: 'nonlethal',
  thu: 'sonic',
  vic: 'untyped',
  ana: 'untyped',
  axi: 'untyped',
  hol: 'untyped',
  unh: 'untyped',
  smh: 'untyped'
}

const tokens = canvas.tokens.controlled
if (tokens.length !== 1) {
  ui.notifications.error("Only one token can be selected")
  return
}

const actor = tokens[0].actor
const level = actor.classes.fighter?.level
if (!level) {
  ui.notifications.error("Token doesnt have any levels in fighter")
}

const bonus = level < 3 ? 0 : Math.floor((level-2)/4) + 1
const twoHandPenalty = level < 10 ? 1 : 0
const maxOhAblBonus = level < 11 ? 1 : level < 15 ? 3 : 5
const maxThAblBonus = level < 15 ? 0 : 2
const abilities = []
if(level > 6) {
  abilities.push('def', 'flm', 'frs', 'ght', 'ken', 'mer', 'shk', 'thu', 'vic', 'smh', 'thr')
}
if (level > 10) {
  abilities.push('ana', 'axi', 'flb', 'icb', 'hol', 'shb', 'unh', 'wou')
}
if (level > 14) {
  abilities.push('spe', 'bre', 'dan')
}

const ablContent = `
  <div class="form-group-stacked">
    <label>Special abilities (Total +${maxOhAblBonus} One Weapon, +${maxThAblBonus} Two Weapon):</label>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin: 0 0 8px 0">`.concat(...abilities.map(a => `
      <div class="flexrow" style="align-items: center">
        <input type="checkbox" name="abilities" value="${a}" id="abl${a}">
        <label for="abl${a}">${abilityList[a]}</label>
      </div>`), `
    </div>
  </div>`)

const numWeaponsContent = `
  <div class="form-group-stacked">
    <label>Number of weapons:</label>
    <div class="form-fields">
      <input type="radio" name="numWeapons" value="1" id="numWeapons1">
      <label for="numWeapons1">One</label>
      <input type="radio" name="numWeapons" value="2" id="numWeapons2">
      <label for="numWeapons2">Two</label>
    </div>
  </div>
`

const content = `
  <form>
    <div class="form-group">
      <label>Weapon:</label>
      <div class="form-fields">
        <input name="name" type="string">
      </div>
    </div>
    ${level > 6 ? numWeaponsContent : ''}
    ${level > 6 ? ablContent : ''}
  </form>
`

await Dialog.prompt({
  title: "Create Gloom Blade",
  content: content,
  callback: async ([html]) => {
    const data = new FormDataExtended(html.querySelector("form")).object;
    
    // delete old gloom weapons
    const old = actor.items.forEach(async i => {
      if (i.flags?.gloom_macro?.gloom) await i.delete()
    })   
    
    // find weapon in compendium
    const weapons = await game.packs.get("pf1.weapons-and-ammo").getDocuments({type: "weapon"});
    const weapon = weapons.find(w => w.name === data.name)
    if (!weapon) {
        ui.notifications.error("Entered weapon is not valid. It must exist in the 'Weapons and Ammo' compendium.");
        return
    }
    
    for (let i=0; i<(data.numWeapons ?? 1); i++) {
      const created = await Item.create(weapon, {parent: actor})
      
      const action = foundry.utils.deepClone(created.system.actions[0], {strict: true})
      let thrownAction;
      const attackNotes = foundry.utils.deepClone(created.system.attackNotes, {strict: true})
      
      if (!action.damage.critParts) action.damage.critParts = []
      if (!action.conditionals) action.conditionals = []
    
      const critMult = (action.ability.critMult ?? 2) - 1
    
      for(const abl of data.abilities) {
        switch (abl) {
          case 'ken':
            action.ability.critRange = (2 * action.ability.critRange) - 21
            break
          case 'thu':
            action.damage.critParts = action.damage.critParts.concat([{
              formula: `${critMult}d8[${abilityLabel[abl]}]`,
              type: {values:[ablToDmgType[abl]], custom: ''}  
            }])
            attackNotes.push(['Target: DC [[14]] Fort save or permanent deafen'])
            break
          case 'flb':
          case 'icb':
          case 'shb':
            action.damage.parts = action.damage.parts.concat([{
              formula: `1d6[${abilityLabel[abl]}]`,
              type: {values:[ablToDmgType[abl]], custom: ''}  
            }])
            action.damage.critParts = action.damage.critParts.concat([{
              formula: `${critMult}d10[${abilityLabel[abl]}]`,
              type: {values:[ablToDmgType[abl]], custom: ''}  
            }])
            break
          case 'flm':
          case 'frs':
          case 'shk':
            action.damage.parts = action.damage.parts.concat([{
              formula: `1d6[${abilityLabel[abl]}]`,
              type: {values:[ablToDmgType[abl]], custom: ''}  
            }])
            break
          case 'mer':
            action.nonlethal = true
            action.damage.parts = action.damage.parts.concat([{
              formula: `1d6[${abilityLabel[abl]}]`,
              type: {values:[ablToDmgType[abl]], custom: ''}  
            }])
            break
          case 'vic':
            action.damage.parts = action.damage.parts.concat([{
              formula: `2d6[${abilityLabel[abl]}]`,
              type: {values:[ablToDmgType[abl]], custom: ''}  
            }])
            attackNotes.push(['[[/d 1d6]]{Vicious Self Damage each attack}'])
            break
          case 'ana':
          case 'axi':
          case 'hol':
          case 'unh':
          case 'smh':
            action.conditionals = action.conditionals.concat([{
              _id: foundry.utils.randomID(),
              name: abilityLabel[abl],
              modifiers: [{
                _id: foundry.utils.randomID(),
                target: 'damage',
                subTarget: 'allDamage', 
                type: '', 
                formula: `2d6[${abilityLabel[abl]}]`, 
                critical: 'normal', 
                damageTypes: {values: [ablToDmgType[abl]], custom: ''}}],
              default: false
            }])
            break
          case 'def':
          case 'ght':
          case 'spe':
          case 'bre':
          case 'dan':
            attackNotes.push([abilityLabel[abl]])
            break
          case 'wou':
            attackNotes.push(['[[/d 1]] Bleed each attack'])
            break
        }
      }      
      
      const updatedActions = [action]
      if (data.abilities.includes('thr')) {
        thrownAction = foundry.utils.deepClone(action, {strict: true})
        thrownAction._id = foundry.utils.randomID(16)
        thrownAction.name = 'Thrown'
        thrownAction.actionType = 'rwak'
        thrownAction.ability.attack = 'dex'
        thrownAction.range = {
          value: 10,
          units: 'ft',
          maxIncrements: 5,
          minUnits: '',
          minValue: null
        }
        
        updatedActions.push(thrownAction)
      }
      
      const updates = {
        name: "Gloom Blade ".concat(weapon.name),
        'flags.gloom_macro': {gloom: true},
        'system.weight.value': 0,
        'system.weaponGroups.custom': "Gloom",
        'system.enh': data.numWeapons === 1 ? bonus : bonus - twoHandPenalty,
        'system.attackNotes': attackNotes,
        'system.actions': updatedActions
      }
      
      const checkedAbilities = data.abilities.filter(a => a !== null)
      if (checkedAbilities.length) {
          let abilityString = '<p><b>Gloom Blade Abilities</b> '
          checkedAbilities.forEach((a, idx) => abilityString += `${idx > 0 ? ', ' : ''}${abilityLabel[a]}`)
          abilityString += '</p>'
          
          updates['system.description.value'] = abilityString + created.system.description.value
      }
    
      await created.update(updates)
    }
  },
});
