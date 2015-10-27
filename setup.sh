# How do we only run this if the javascriptcom database doesn't exist?

if psql javascriptcom -c '\q' 2>&1
then
  # The database exists
  echo "javascriptcom database already loaded"
else
  createdb javascriptcom
  ./node_modules/node-pg-migrate/bin/pg-migrate up
fi

echo "installing bower assets"
npm run bower install

echo "compiling assets"
npm run gulp build
