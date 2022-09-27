DIR=assets/emoji;

OBJ_ALL="export default {\n";
OBJ_STATIC='export const STATIC_EMOJI = {\n';
JSON_STATIC="[\n";

for file in "$DIR/static"/*; do
    N="$(basename "$file")";   
    N="${N/%.png/}";
    OBJ_ALL+='  '$N': { name: "'$N'", path: '"require('../../"${file}"')"' },\n';
    OBJ_STATIC+='  '$N': '"require('../../"${file}"')"',\n';
    JSON_STATIC+='"'$N'",\n';
done
OBJ_STATIC+='}';
JSON_STATIC+=']';
# echo "$OBJ_STATIC" > src/resources/emoji_static.ts

OBJ_ANIMATED='export const ANIMATED_EMOJI = {\n';
JSON_ANIMATED='[\n';
for file in "$DIR/animated"/*; do
    N="$(basename "$file")";   
    N="${N/%.gif/}";
    OBJ_ALL+='  '$N': { name: "'$N'", path: '"require('../../"${file}"')"' },\n';
    OBJ_ANIMATED+='  '$N': '"require('../../"${file}"')"',\n';
    JSON_ANIMATED+='"'$N'",\n';
done
OBJ_ALL+='}';
OBJ_ANIMATED+='}';
JSON_ANIMATED+=']';
# echo "$OBJ_ANIMATED" > src/resources/emoji_animated.ts

echo "$OBJ_ALL" > src/resources/custom_emojis.ts
echo "$OBJ_STATIC\n\n$OBJ_ANIMATED" > src/resources/emoji.ts
echo '{\n"static": '$JSON_STATIC',\n"animated": '$JSON_ANIMATED'\n}' > emojis.json

