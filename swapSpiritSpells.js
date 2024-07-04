if (canvas.tokens.controlled.length !== 1) {
  ui.notifications.error("only one token can be selected");
  return;
}

const spellbook = 'secondary'
const fixed = 'hea'

const spiritLabels = {
    anc: 'Ancestors',
    bat: 'Battle',
    bon: 'Bones',
    fla: 'Flames',
    fro: 'Frost',
    hea: 'Heavens',
    lif: 'Life',
    lor: 'Lore',
    mam: 'Mammoth',
    nat: 'Nature',
    slu: 'Slums',
    smo: 'Smoke',
    sto: 'Stone',
    tri: 'Tribe',
    wav: 'Waves',
    win: 'Wind',
    woo: 'Wood'
}

const spellList = {
  anc: ['jhyb2ana8jrk2lut', 'avofn5q2v0f0qxjy', 'vqfrp8t0c1lw1jna', '0lrux8tmaml5fkw6', '3lfx1ccxo2hdqrf3', 'z0duc2v2n3ioynta', 'btccs4sjo2nog1a0', 'aqeaxoaozlv9vg35', 'lnahlmp5mih2ongh'],
  bat: ['jnlr9cuepka1l26e', 'g33euis7yi9pwddy', '73han2zqxg59u18g', '92hth51cs9oi0nfe', '6ax0ythzw8n4bta8', '8xjcrqg79ugxu5qu', '578t0lra5ll3aifs', 'a5gcbpwfhu4hh5ic', 'n4e35m6qu9nmkhgm'],
  bon: ['9tww9fc9049h6iqc', '3ze0kso9hxff5u2f', '8uwmrygxgih1fb57', 'be88e90guqbi1q1z', 'dg3mrasygkm83c3e', '3a162m66toj22fpa', 'wkp8u7xl1dgpk362', 'e8zen5nzixnt7bde', 'wplgawb6aznjx7se'],
  fla: ['lndeaqm2j2nvgm6p', 'tkjnm3lw7ni82tag', '6oq1wcryviik9ice', '92hth51cs9oi0nfe', 'hd7ukybisvv7j5r6', '0hknfnoaljc75fj3', '9wl8ijy6argdvz5f', 'iq0as5470o8q9y39', 'qk3oeq4awbc1smjw'],
  fro: ['grgpvfexq2dh31fq', 'jgx8sur7w4k93mql', 'q35l6m4pggb4y98v', 't1uhggjfimtabp4v', 'hd7ukybisvv7j5r6', 'ol05jfb606v0lzj9', 'qubzqiz5mqs8tbqr', '8jq1atxonnerix55', 'ezpm33cvtlq8aswa'],
  hea: ['qcjskol4ac3eemhy', 'zyfm6dq35i4hip4u', '7x2z0i8rcx7s81fk', '6lebv7569xsypp8u', 'wqvy12w1xgk6l9b0', '6vfauefzzmwl4az7', 'mb819hvwpk0zmw53', 'j2mwv9wfxhqch10g', 'xhzme0v6tjq95fg6'],
  lif: ['aa0w7tk852iqn3ni', 'fxz69pwpqt9b6uss', '6l904edkt8jv9jor', 'anya5qwdjhdfyk8u', 'qiiis9ekgy3syu7j', '4re1j2w8wkvsvnsi', 'igmb8lisqcnsxd2d', 'klcvk9ct1l7mhjwp', 'mxqi375ya2rka7cp'],
  lor: ['llxrra87kbofmyhl', 'm1rmcpcaixcpz9ib', 'tcnirpnzjdaym1fd', 'b5mz8voksps5g4yq', '68ngvzmzvadhf6vs', '14chms7xurvi85x9', 'aqeaxoaozlv9vg35', '2vb5orfcy57lrfmc', '7mstq5c76h3e6zzx'],
  mam: ['jnlr9cuepka1l26e', '05i5rxwim12hwktu', '8u1xa5javcxc6szk', 'knyako6zopc1chrv', 'w88ddxpu89qcr5c0', 'hzkaqaa8n6ygwmub', 'jjmoi5qbwkbguzbn', 'ukacuu0cvdjkqxwu', '0mt9mso6wdhfafpo'],
  nat: ['pg7dbmuuaksxhp3v', 'la7kuehewu85ybnt', 'rrsefzpm3nhztvld', '0sssdtv0tkbns2r3', 'h9qiwo9kx8d1hqrn', 'wgm8mm1za909pwch', 'f828mjoo5afszqnk', '3ah9mmg0odateh8l', 'refg1teqkrdtxllg'],
  slu: ['tjog6bufg5b08lvq', 'vxi9c3xwa83xthka', '78kwl5t99j9e8tzh', 'n0bsyxchnigkkuqo', 'l83djt5019ujasjh', '446vcsetq4ny904e', 'uddlhatt6uq4e5yf', 'hi72gh3dlf7a1qyt', 'esia6azb5g68tfs7'],
  smo: ['tuh5vc2bojaws3ig', 'x5hunybxpzhd3gcm', 'kjke96zd1j1jz48z', 'mqdoexj35atgqafn', 'im8z5kfg8ohowie9', '1mkigzpu5hohovgw', '0w3hvcp3gb2bhtv5', 'iq0as5470o8q9y39', 'gw9bes9othfqm7mi'],
  sto: ['fv9mgob508qv99zz', 'gqtg9ruv8kkd0knf', 'dkv9v4verb82fmpx', 'l83djt5019ujasjh', 'knyako6zopc1chrv', 'wgm8mm1za909pwch', 'g52zx1t1giteg5h1', 'oeemcnfjod9zd7my', 'o8jhvddxgunzx94i'],
  tri: ['wa0zb2pncesmm9lz', 'menqakfoa1ftvi3f', 'qn947hen3wrelxhz', '0lrux8tmaml5fkw6', 'f6lqt3ju8m7r5la2', 'eg3i21asvo69mbma', 'aqeaxoaozlv9vg35', 'gw2sgj93dgarpem8', 'klcvk9ct1l7mhjwp'],
  wav: ['ohy0ty2dawfaaqwd', '7fvsn0gbv6ynlp63', '7m5us8d4a9lwh1ap', 'ijui94bv4uzu8awb', 'nll8ip8348eti0ff', 'h4nlrm44ubsyzuhz', 'tpid8izzs2rrfxv3', 'o4rwtizvdj7216qd', 'ltda70etgwje43x6'],
  win: ['nkd3xocluvt1rovu', 'cnuin981hdq7ryit', 'fe8jy0h1l3su2322', '4gxx3bodf76e63en', 'g9koefk7x9szoheo', 'nk37t5em8q4v1djs', '578t0lra5ll3aifs', 'i9greyz3c0ap32vi', 'lun2gymejsmkjg4g'],
  woo: ['v05u8sl116ab2n9c', 'la7kuehewu85ybnt', 'jsvjsax2eabrlx8g', '818uuekrao87o57u', '6x6epf4g5wgzl1gh', 'xmacjpo6tgm1xhnv', '3fravqa4vrm4ygkr', 'cp5m19me647dojha', '9fd7mcoint902oyb']
}

const content = `
  <form>
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px; margin: 0 0 8px 0">
    `.concat(...Object.entries(spiritLabels).filter(l => l[0] !== fixed).map(([key, label]) => `
      <div>
        <input type="radio" id="${key}" name="spirit" value="${key}">
        <label for="${key}">${label}</label>
      </div>`), `
    </div>
  </form>
`)

await Dialog.prompt({
  title: "Swap Spirit Spells",
  content: content,
  callback: async ([html]) => {
    const data = new FormDataExtended(html.querySelector("form")).object;
    
    const actor = canvas.tokens.controlled[0].actor;

    const oldSpells = actor.itemTypes.spell.filter((i) => i.system.spellbook === spellbook);
    const toRemove = oldSpells.map((spell) => spell._id);
    await actor.deleteEmbeddedDocuments("Item", toRemove);
    
    const newSpellIds = [...spellList[fixed], ...spellList[data.spirit]];
    const newSpells = await Promise.all(newSpellIds.map((id) => game.packs.get("pf1.spells").getDocument(id)));
    await actor.createEmbeddedDocuments(
      "Item",
      newSpells.map((spell, idx) => mergeObject(spell.toObject(), { system: { spellbook: spellbook, level: idx%9+1 } }))
    );
  }
})
