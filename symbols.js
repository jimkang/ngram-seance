var symbols = {
  upSymbols: [
    '↑',
    '⇑',
    '⇡',
    '⇧',
    '⇧',
    '⇪',
    '⟰',
    '⥠',
    '⇯',
    '⇈',
    '⇮',
    '⇭',
    '⥘',
    '⥔',
    '⇬',
    '⇫',
    '↿',
    '↾',
    '↥',
    '⤊',
    '↟',
    '⤉',
    '⇞',
    '⤒',
    '⥉'
  ],
  downSymbols: [
    '↓',
    '⇓',
    '⇩',
    '⇣',
    '☟',
    '⥥',
    '↡',
    '↧',
    '⤋',
    '⟱',
    '⇟',
    '⇊',
    '⥡',
    '⤈',
    '↯',
    '⥝',
    '⇃',
    '⥙',
    '⇂',
    '⥕'
  ],
  magickSymbols: [
    '💯', // '100'
    '⁉️', // 'interrobang'
    '☀️', // 'sunny'
    '☁️', // 'cloud'
    '☔️', // 'umbrella'
    '☕️', // 'coffee'
    '✨', // 'sparkles'
    '❤️', // 'heart'
    '⌛️', // 'hourglass'
    '⏳', // 'hourglass_flowing_sand'
    '☝️', // 'point_up'
    '⚡️', // 'zap'
    '⭐️', // 'star'
    '🌀', // 'cyclone'
    '🌁', // 'foggy'
    '🌃', // 'night_with_stars'
    '🌄', // 'sunrise_over_mountains'
    '🌅', // 'sunrise'
    '🌈', // 'rainbow'
    '🌉', // 'bridge_at_night'
    '🌊', // 'ocean'
    '🌋', // 'volcano'
    '🌌', // 'milky_way'
    '🌍', // 'earth_africa'
    '🌎', // 'earth_americas'
    '🌏', // 'earth_asia'
    '🌑', // 'new_moon'
    '🌒', // 'waxing_crescent_moon'
    '🌓', // 'first_quarter_moon'
    '🌔', // 'moon'
    '🌕', // 'full_moon'
    '🌖', // 'waning_gibbous_moon'
    '🌗', // 'last_quarter_moon'
    '🌘', // 'waning_crescent_moon'
    '🌙', // 'crescent_moon'
    '🌚', // 'new_moon_with_face'
    '🌛', // 'first_quarter_moon_with_face'
    '🌜', // 'last_quarter_moon_with_face'
    '🌝', // 'full_moon_with_face'
    '🌞', // 'sun_with_face'
    '🌟', // 'star2'
    '🌠', // 'stars'
    '🌿', // 'herb'
    '🍀', // 'four_leaf_clover'
    '🍂', // 'fallen_leaf'
    '🍃', // 'leaves'
    '🍄', // 'mushroom'
    '🍃', // 'leaves'
    '🎑', // 'rice_scene'
    '🏯', // 'japanese_castle'
    '🏰', // 'european_castle'
    '🐀', // 'rat'
    '🐁', // 'mouse2'
    '🐂', // 'ox'
    '🐃', // 'water_buffalo'
    '🐄', // 'cow2'
    '🐅', // 'tiger2'
    '🐆', // 'leopard'
    '🐇', // 'rabbit2'
    '🐈', // 'cat2'
    '🐉', // 'dragon'
    '🐊', // 'crocodile'
    '🐋', // 'whale2'
    '🐌', // 'snail'
    '🐍', // 'snake'
    '🐎', // 'racehorse'
    '🐏', // 'ram'
    '🐐', // 'goat'
    '🐑', // 'sheep'
    '🐒', // 'monkey'
    '🐓', // 'rooster'
    '🐔', // 'chicken'
    '🐕', // 'dog2'
    '🐖', // 'pig2'
    '🐗', // 'boar'
    '🐘', // 'elephant'
    '🐙', // 'octopus'
    '🐚', // 'shell'
    '🐛', // 'bug'
    '🐜', // 'ant'
    '🐝', // 'bee'
    '🐞', // 'beetle'
    '🐟', // 'fish'
    '🐠', // 'tropical_fish'
    '🐡', // 'blowfish'
    '🐢', // 'turtle'
    '🐪', // 'dromedary_camel'
    '🐫', // 'camel'
    '🐬', // 'dolphin'
    '🐭', // 'mouse'
    '🐮', // 'cow'
    '🐯', // 'tiger'
    '🐰', // 'rabbit'
    '🐱', // 'cat'
    '🐲', // 'dragon_face'
    '🐳', // 'whale'
    '🐴', // 'horse'
    '🐵', // 'monkey_face'
    '🐶', // 'dog'
    '🐷', // 'pig'
    '🐸', // 'frog'
    '🐺', // 'wolf'
    '🐻', // 'bear'
    '👑', // 'crown'
    '👹', // 'japanese_ogre'
    '👻', // 'ghost'
    '👽', // 'alien'
    '👾', // 'space_invader'
    '👿', // 'imp'
    '💀', // 'skull'
    '💔', // 'broken_heart'
    '💨', // 'dash'
    '💫', // 'dizzy'
    '🔑', // 'key'
    '🔥', // 'fire'
    '🔮', // 'crystal_ball'
    '🕐', // 'clock1'
    '🕑', // 'clock2'
    '🕒', // 'clock3'
    '🕓', // 'clock4'
    '🕔', // 'clock5'
    '🕕', // 'clock6'
    '🕖', // 'clock7'
    '🕗', // 'clock8'
    '🕘', // 'clock9'
    '🕙', // 'clock10'
    '🕚', // 'clock11'
    '🕛', // 'clock12'
    '🕜', // 'clock130'
    '🕝', // 'clock230'
    '🕞', // 'clock330'
    '🕟', // 'clock430'
    '🕠', // 'clock530'
    '🕡', // 'clock630'
    '🕢', // 'clock730'
    '🕣', // 'clock830'
    '🕤', // 'clock930'
    '🕥', // 'clock1030'
    '🕦', // 'clock1130'
    '🕧', // 'clock1230'
    '🙏', // 'pray'
    '🚀', // 'rocket'
    '🍵' // 'tea'
  ]
};

module.exports = symbols;
