for d in ./*/ ; do (echo "$d" && cd "$d" && go test); done
