# Cleanup
rm -rf ./build/

# Bulding javascript
npm run build

# Copying data
cp -r ./data build/data

# Templating index
sed s@/build/bundle.js@$BASE_URL/bundle.js@ index.html > build/index.html
