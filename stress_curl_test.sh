#!/bin/bash
for i in `seq 1 2`;
do
    echo "Test n. " $i

    curl http://127.0.0.1:9000/api/lightning/listinvoices &
    curl http://127.0.0.1:9000/api/lightning/listpeers &
    curl http://127.0.0.1:9000/api/lightning/getnewaddress &
    curl http://127.0.0.1:9000/api/lightning/listfunds &
    curl http://127.0.0.1:9000/api/lightning/listinvoices &
    curl http://127.0.0.1:9000/api/lightning/listpeers &
done
