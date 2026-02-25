import sys
import pkg_resources

print("Python Version:", sys.version)
print("\nSystem Path:", sys.path)

print("\nInstalled Packages:")
installed_packages = sorted(["%s==%s" % (i.key, i.version) for i in pkg_resources.working_set])
for pkg in installed_packages:
    print(pkg)

try:
    import psycopg2
    print("\n✅ psycopg2 imported successfully!")
    print("psycopg2 file:", psycopg2.__file__)
except ImportError as e:
    print("\n❌ Failed to import psycopg2:", e)

try:
    import psycopg2.extensions
    print("✅ psycopg2.extensions imported successfully!")
except Exception as e:
    print("❌ Failed to import psycopg2.extensions:", e)
